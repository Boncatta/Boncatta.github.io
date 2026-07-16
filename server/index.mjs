import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { Readable } from "node:stream";
import { extname, join, normalize, resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import {
  BattleEngine,
  CHARACTER_DEFS,
  DEFAULT_CHARS,
  MODES,
  applySelectionsToRoom,
  cleanSelection,
  cleanUsername,
  makeSeats,
  seatTeamLabel,
  seatsForUser,
} from "./rules.mjs";
import { getDb, pruneSessions, saveDb } from "./store.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(process.env.BONCATTA_PUBLIC_DIR || root);
const port = Number(process.env.PORT || process.env.BONCATTA_PORT || 8787);
const sessionDays = 30;
const roomMaxAgeMs = 1000 * 60 * 60 * 6;
const githubReleaseApi = "https://api.github.com/repos/Boncatta/Boncatta.github.io/releases/tags/apk-latest";

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function nowIso() {
  return new Date().toISOString();
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
    "cache-control": "no-store",
  });
  res.end(body);
}

function fail(res, status, message) {
  json(res, status, { ok: false, error: message });
}

function publicBase(req) {
  const proto = String(req.headers["x-forwarded-proto"] || "http").split(",")[0];
  const host = req.headers["x-forwarded-host"] || req.headers.host || `localhost:${port}`;
  return `${proto}://${host}`;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    const err = new Error("请求体不是合法 JSON。");
    err.status = 400;
    throw err;
  }
}

function passwordHash(password, salt) {
  return scryptSync(String(password), salt, 32).toString("hex");
}

function verifyPassword(user, password) {
  const expected = Buffer.from(user.passwordHash, "hex");
  const actual = Buffer.from(passwordHash(password, user.salt), "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function createToken(username) {
  const db = getDb();
  const token = randomBytes(32).toString("hex");
  db.sessions[token] = {
    username,
    createdAt: nowIso(),
    expiresAt: new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000).toISOString(),
  };
  saveDb();
  return token;
}

function auth(req) {
  pruneSessions();
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = token ? getDb().sessions[token] : null;
  if (!session) return null;
  const user = getDb().users[session.username];
  if (!user) return null;
  return { token, username: session.username, user };
}

function requireAuth(req, res) {
  const session = auth(req);
  if (!session) {
    fail(res, 401, "请先登录。");
    return null;
  }
  return session;
}

function publicUser(user) {
  return {
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    stats: user.stats || emptyStats(),
  };
}

function emptyStats() {
  return { games: 0, wins: 0, losses: 0, actions: 0, roomsCreated: 0 };
}

function roomCode(seed = "") {
  const raw = createHash("sha1").update(`${seed}:${Date.now()}:${Math.random()}`).digest("hex");
  return raw.slice(0, 5).toUpperCase();
}

function roomStatus(room) {
  if (room.status === "playing" || room.status === "finished") return room.status;
  const count = room.seats.filter((seat) => seat.occupied).length;
  return count >= MODES[room.mode].minStart ? "ready" : "waiting";
}

function summarizeRoom(room) {
  const count = room.seats.filter((seat) => seat.occupied).length;
  return {
    code: room.code,
    mode: room.mode,
    label: MODES[room.mode].label,
    status: roomStatus(room),
    count,
    maxSeats: MODES[room.mode].maxSeats,
    host: room.host,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    summary: room.seats
      .filter((seat) => seat.occupied)
      .map((seat) => `${seat.selection.name}/${seatTeamLabel(room.mode, seat.index)}`)
      .join(" · "),
  };
}

function publicRoom(room) {
  return {
    ...summarizeRoom(room),
    seats: room.seats,
    battle: room.battle,
    mySeats: [],
  };
}

function publicRoomFor(room, username) {
  return { ...publicRoom(room), mySeats: seatsForUser(room, username) };
}

function occupy(room, username, selections, preferred = null) {
  const wanted = Array.isArray(selections) ? selections : [selections];
  const occupyOne = (index, pick) => {
    room.seats[index] = {
      ...room.seats[index],
      occupied: true,
      username,
      selection: cleanSelection(pick, username, DEFAULT_CHARS[index] || "undead"),
    };
  };
  if (room.mode === "commander" && preferred == null) {
    const start = username === room.host ? 0 : 2;
    occupyOne(start, wanted[0]);
    occupyOne(start + 1, wanted[1] || wanted[0]);
    return start;
  }
  const index = preferred ?? room.seats.findIndex((seat, i) => i > 0 && !seat.occupied);
  if (index < 0) return null;
  occupyOne(index, wanted[0]);
  return index;
}

function createRoom(username, mode, selections) {
  const db = getDb();
  const config = MODES[mode] || MODES.duel;
  let code = roomCode(username);
  while (db.rooms[code]) code = roomCode(`${username}-${code}`);
  const room = {
    code,
    mode: config === MODES[mode] ? mode : "duel",
    host: username,
    status: "waiting",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    seats: makeSeats(config === MODES[mode] ? mode : "duel"),
    battle: null,
    statsApplied: false,
  };
  occupy(room, username, selections, config.setup === "team" ? null : 0);
  db.rooms[code] = room;
  db.users[username].stats.roomsCreated += 1;
  db.users[username].updatedAt = nowIso();
  saveDb({ backup: true });
  return room;
}

function joinRoom(room, username, selections) {
  if (room.status === "playing" || room.status === "finished") throw httpError(409, "战斗已经开始。");
  if (seatsForUser(room, username).length) return room;
  if (room.mode === "commander") {
    if (room.seats[2].occupied || room.seats[3].occupied) throw httpError(409, "房间已满。");
    occupy(room, username, selections);
  } else {
    const index = room.seats.findIndex((seat, i) => i > 0 && !seat.occupied);
    if (index < 0) throw httpError(409, "房间已满。");
    occupy(room, username, selections, index);
  }
  room.updatedAt = nowIso();
  saveDb();
  return room;
}

function startRoom(room, username) {
  if (room.host !== username) throw httpError(403, "只有房主可以开始。");
  const occupied = room.seats.filter((seat) => seat.occupied);
  if (occupied.length < MODES[room.mode].minStart) throw httpError(409, "人数不足。");
  room.status = "playing";
  room.battle = new BattleEngine(room.mode, occupied).clone();
  room.statsApplied = false;
  room.updatedAt = nowIso();
  saveDb();
  return room;
}

function canAct(room, username) {
  if (!room.battle || room.status !== "playing") return false;
  const engine = BattleEngine.fromSnapshot(room.battle, room.mode);
  const current = engine.currentFighter();
  return Boolean(current && current.username === username && !engine.gameOver);
}

function applyStats(room) {
  if (!room.battle?.gameOver || room.statsApplied) return;
  const db = getDb();
  const participants = [...new Set(room.seats.filter((seat) => seat.occupied).map((seat) => seat.username))];
  const winners = new Set();
  if (room.battle.winnerTeam != null) {
    for (const player of room.battle.players || []) {
      if (player.health > 0 && player.team === room.battle.winnerTeam) winners.add(player.username);
    }
  }
  for (const username of participants) {
    const stats = db.users[username]?.stats;
    if (!stats) continue;
    stats.games += 1;
    if (winners.has(username)) stats.wins += 1;
    else stats.losses += 1;
    db.users[username].updatedAt = nowIso();
  }
  db.matches.unshift({
    code: room.code,
    mode: room.mode,
    finishedAt: nowIso(),
    participants,
    winners: [...winners],
  });
  db.matches = db.matches.slice(0, 200);
  room.statsApplied = true;
}

function actRoom(room, username, targets) {
  if (!canAct(room, username)) throw httpError(403, "现在不是你的行动。");
  const engine = BattleEngine.fromSnapshot(room.battle, room.mode);
  engine.takeAction(targets || {});
  room.battle = engine.clone();
  room.status = room.battle.gameOver ? "finished" : "playing";
  room.updatedAt = nowIso();
  getDb().users[username].stats.actions += 1;
  getDb().users[username].updatedAt = nowIso();
  applyStats(room);
  saveDb({ backup: room.status === "finished" });
  return room;
}

function resetRoom(room, username) {
  if (room.host !== username) throw httpError(403, "只有房主可以重开。");
  room.status = roomStatus({ ...room, status: "waiting" });
  room.battle = null;
  room.statsApplied = false;
  room.updatedAt = nowIso();
  saveDb();
  return room;
}

function leaveRoom(room, username) {
  if (room.status === "playing") throw httpError(409, "战斗中不能离开。");
  for (const seat of room.seats) {
    if (seat.username === username) {
      seat.occupied = false;
      seat.username = "";
    }
  }
  if (room.host === username || !room.seats.some((seat) => seat.occupied)) {
    delete getDb().rooms[room.code];
  } else {
    room.updatedAt = nowIso();
  }
  saveDb();
}

function pruneRooms() {
  const db = getDb();
  const cutoff = Date.now() - roomMaxAgeMs;
  let changed = false;
  for (const [code, room] of Object.entries(db.rooms)) {
    if (room.status !== "playing" && Date.parse(room.updatedAt || room.createdAt || 0) < cutoff) {
      delete db.rooms[code];
      changed = true;
    }
  }
  if (changed) saveDb({ backup: true });
}

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function parseReleaseMeta(release) {
  const body = String(release?.body || "");
  const jsonText = body.match(/\{[\s\S]*\}/)?.[0] || "{}";
  let meta = {};
  try { meta = JSON.parse(jsonText); } catch { meta = {}; }
  const assets = release?.assets || [];
  const apk = assets.find((asset) => asset.name === meta.apkFile)
    || assets.find((asset) => /^boncatta-.*\.apk$/i.test(asset.name || ""))
    || assets.find((asset) => /\.apk$/i.test(asset.name || ""));
  return {
    versionCode: Number(meta.versionCode || 0),
    versionName: meta.versionName || release?.name || "未知",
    apkFile: meta.apkFile || apk?.name || "boncatta.apk",
    sourceUrl: apk?.browser_download_url || "",
  };
}

async function latestApkMeta(req) {
  if (process.env.BONCATTA_APK_URL) {
    return {
      versionCode: Number(process.env.BONCATTA_APK_VERSION_CODE || 0),
      versionName: process.env.BONCATTA_APK_VERSION_NAME || "自定义版本",
      apkFile: process.env.BONCATTA_APK_FILE || "boncatta.apk",
      sourceUrl: process.env.BONCATTA_APK_URL,
      apkUrl: `${publicBase(req)}/api/app/download`,
    };
  }
  const response = await fetch(githubReleaseApi, {
    headers: { "user-agent": "boncatta-api" },
  });
  if (!response.ok) throw httpError(502, "无法读取 APK 发布信息。");
  const meta = parseReleaseMeta(await response.json());
  return { ...meta, apkUrl: `${publicBase(req)}/api/app/download` };
}

async function proxyApk(req, res) {
  const meta = await latestApkMeta(req);
  if (!meta.sourceUrl) throw httpError(404, "没有可下载的 APK。");
  const response = await fetch(meta.sourceUrl, { headers: { "user-agent": "boncatta-api" } });
  if (!response.ok || !response.body) throw httpError(502, "APK 源下载失败。");
  res.writeHead(200, {
    "content-type": "application/vnd.android.package-archive",
    "content-disposition": `attachment; filename="${meta.apkFile || "boncatta.apk"}"`,
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
  });
  Readable.fromWeb(response.body).pipe(res);
}

async function api(req, res, path) {
  if (req.method === "OPTIONS") return json(res, 204, {});
  const body = req.method === "GET" ? {} : await readBody(req);
  pruneRooms();

  if (req.method === "GET" && path === "/api/health") {
    return json(res, 200, { ok: true, time: nowIso() });
  }

  if (req.method === "GET" && path === "/api/meta") {
    const modes = Object.fromEntries(Object.entries(MODES).map(([key, value]) => [key, {
      label: value.label,
      short: value.short,
      maxSeats: value.maxSeats,
      minStart: value.minStart,
      setup: value.setup,
      note: value.note,
    }]));
    return json(res, 200, { ok: true, characters: CHARACTER_DEFS, modes });
  }

  if (req.method === "GET" && path === "/api/app/latest") {
    return json(res, 200, { ok: true, ...(await latestApkMeta(req)) });
  }

  if (req.method === "GET" && path === "/api/app/download") {
    return proxyApk(req, res);
  }

  if (req.method === "POST" && path === "/api/auth/login") {
    const username = cleanUsername(body.username);
    const password = String(body.password || "");
    if (!username) return fail(res, 400, "请输入用户名。");
    if (!/^\d{6,}$/.test(password)) return fail(res, 400, "密码必须是六位以上数字。");
    const db = getDb();
    let user = db.users[username];
    if (user && !verifyPassword(user, password)) return fail(res, 403, "密码不正确。");
    if (!user) {
      const salt = randomBytes(16).toString("hex");
      user = {
        username,
        salt,
        passwordHash: passwordHash(password, salt),
        createdAt: nowIso(),
        updatedAt: nowIso(),
        stats: emptyStats(),
      };
      db.users[username] = user;
      saveDb({ backup: true });
    }
    const token = createToken(username);
    return json(res, 200, { ok: true, token, user: publicUser(user) });
  }

  if (req.method === "POST" && path === "/api/auth/logout") {
    const session = auth(req);
    if (session) {
      delete getDb().sessions[session.token];
      saveDb();
    }
    return json(res, 200, { ok: true });
  }

  const session = requireAuth(req, res);
  if (!session) return;

  if (req.method === "GET" && path === "/api/me") {
    const myRooms = Object.values(getDb().rooms)
      .filter((room) => seatsForUser(room, session.username).length)
      .map((room) => publicRoomFor(room, session.username));
    return json(res, 200, { ok: true, user: publicUser(session.user), rooms: myRooms });
  }

  if (req.method === "GET" && path === "/api/rooms") {
    const rooms = Object.values(getDb().rooms)
      .map((room) => ({ ...summarizeRoom(room), mySeats: seatsForUser(room, session.username) }))
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
    return json(res, 200, { ok: true, rooms });
  }

  if (req.method === "POST" && path === "/api/rooms") {
    const mode = body.mode in MODES ? body.mode : "duel";
    const room = createRoom(session.username, mode, body.selections || body.selection);
    return json(res, 200, { ok: true, room: publicRoomFor(room, session.username) });
  }

  const roomMatch = path.match(/^\/api\/rooms\/([A-Z0-9]{5})(?:\/([a-z]+))?$/i);
  if (roomMatch) {
    const code = roomMatch[1].toUpperCase();
    const action = roomMatch[2] || "";
    const room = getDb().rooms[code];
    if (!room) return fail(res, 404, "房间不存在。");

    if (req.method === "GET" && !action) return json(res, 200, { ok: true, room: publicRoomFor(room, session.username) });
    if (req.method === "POST" && action === "join") return json(res, 200, { ok: true, room: publicRoomFor(joinRoom(room, session.username, body.selections || body.selection), session.username) });
    if (req.method === "POST" && action === "selection") return json(res, 200, { ok: true, room: publicRoomFor(applySelectionsToRoom(room, session.username, body.selections || body.selection), session.username) });
    if (req.method === "POST" && action === "start") return json(res, 200, { ok: true, room: publicRoomFor(startRoom(room, session.username), session.username) });
    if (req.method === "POST" && action === "action") return json(res, 200, { ok: true, room: publicRoomFor(actRoom(room, session.username, body.targets), session.username) });
    if (req.method === "POST" && action === "reset") return json(res, 200, { ok: true, room: publicRoomFor(resetRoom(room, session.username), session.username) });
    if (req.method === "POST" && action === "leave") {
      leaveRoom(room, session.username);
      return json(res, 200, { ok: true });
    }
  }

  return fail(res, 404, "接口不存在。");
}

function serveStatic(req, res, pathname) {
  let file = pathname === "/" ? "/index.html" : pathname;
  file = normalize(file).replace(/^(\.\.[/\\])+/, "");
  const full = resolve(join(publicDir, file));
  if (!full.startsWith(publicDir) || !existsSync(full)) return false;
  const type = mime[extname(full)] || "application/octet-stream";
  res.writeHead(200, { "content-type": type, "cache-control": "no-store" });
  res.end(readFileSync(full));
  return true;
}

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  try {
    if (url.pathname.startsWith("/api/")) return await api(req, res, url.pathname);
    if (serveStatic(req, res, url.pathname)) return;
    fail(res, 404, "Not found");
  } catch (error) {
    fail(res, error.status || 500, error.message || "服务器错误。");
  }
}).listen(port, () => {
  console.log(`Boncatta API listening on http://localhost:${port}`);
});
