import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { Readable } from "node:stream";
import { extname, join, normalize, resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import {
  ACTION_TIME_LIMIT_MS,
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
const aiNames = ["Tata", "Frost", "Med", "Blade", "Knight", "Nova"];
const aiDelayMs = Number(process.env.BONCATTA_AI_DELAY_MS || 750);
const aiTimers = new Map();
const turnTimers = new Map();

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
    replayCount: room.replay?.length || 0,
    mySeats: [],
  };
}

function publicRoomFor(room, username) {
  const mySeats = seatsForUser(room, username);
  return { ...publicRoom(room), mySeats, spectator: !mySeats.length };
}

function matchSummary(match) {
  return {
    id: match.id || `${match.code}-${match.finishedAt || ""}`,
    code: match.code,
    mode: match.mode,
    label: MODES[match.mode]?.label || match.mode,
    finishedAt: match.finishedAt,
    participants: match.participants || [],
    winners: match.winners || [],
    replayCount: match.replay?.length || 0,
  };
}

function publicMatch(match) {
  return {
    ...matchSummary(match),
    players: match.players || [],
    replay: match.replay || [],
  };
}

function recordReplay(room, label = "") {
  if (!room?.battle) return;
  room.replay = Array.isArray(room.replay) ? room.replay : [];
  room.replay.push({
    at: nowIso(),
    label,
    battle: BattleEngine.fromSnapshot(room.battle, room.mode).clone(),
  });
  room.replay = room.replay.slice(-120);
}

function clearTurnTimer(code) {
  const key = String(code || "").toUpperCase();
  const timer = turnTimers.get(key);
  if (timer) clearTimeout(timer);
  turnTimers.delete(key);
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

function isAiUsername(username) {
  return String(username || "").startsWith("AI#");
}

function aiSelection(room, seatIndex) {
  const used = room.seats.filter((seat) => isAiUsername(seat.username)).length;
  const characterId = DEFAULT_CHARS[(seatIndex + used) % DEFAULT_CHARS.length] || "undead";
  return cleanSelection({
    name: `${aiNames[(seatIndex + used) % aiNames.length]} AI`,
    characterId,
  }, "AI", characterId);
}

function addAi(room, count = 1) {
  if (room.status === "playing" || room.status === "finished") throw httpError(409, "Battle already started.");
  let added = 0;
  for (let i = 0; i < count; i += 1) {
    const index = room.seats.findIndex((seat) => !seat.occupied);
    if (index < 0) break;
    room.seats[index] = {
      ...room.seats[index],
      occupied: true,
      username: `AI#${room.code}#${Date.now()}#${index}`,
      selection: aiSelection(room, index),
    };
    added += 1;
  }
  if (!added) throw httpError(409, "Room is full.");
  room.updatedAt = nowIso();
  saveDb();
  return room;
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
    replay: [],
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
  room.replay = [];
  recordReplay(room, "战斗开始");
  room.statsApplied = false;
  room.updatedAt = nowIso();
  saveDb();
  scheduleBattleAutomation(room);
  return room;
}

function canAct(room, username) {
  if (!room.battle || room.status !== "playing") return false;
  const engine = BattleEngine.fromSnapshot(room.battle, room.mode);
  const current = engine.currentFighter();
  return Boolean(current && current.username === username && !engine.gameOver);
}

function aiTargets(engine) {
  const enemies = engine.aliveIndexes("enemy");
  const others = engine.aliveIndexes("anyOther");
  const fallback = enemies[0] ?? others[0] ?? engine.current ?? 0;
  return {
    primary: fallback,
    secondary: enemies[1] ?? fallback,
    tertiary: enemies[2] ?? fallback,
    multi: enemies.length ? enemies : others,
  };
}

function runAiTurns(room, limit = 24) {
  if (!room.battle || room.status !== "playing") return;
  const engine = BattleEngine.fromSnapshot(room.battle, room.mode);
  let guard = 0;
  while (!engine.gameOver && guard < limit) {
    const current = engine.currentFighter();
    if (!current || !isAiUsername(current.username)) break;
    engine.takeAction(aiTargets(engine));
    guard += 1;
  }
  room.battle = engine.clone();
  room.status = room.battle.gameOver ? "finished" : "playing";
}

function finishAutomatedStep(room, engine, label, actorUsername = "") {
  room.battle = engine.clone();
  room.status = room.battle.gameOver ? "finished" : "playing";
  room.updatedAt = nowIso();
  if (actorUsername && getDb().users[actorUsername]?.stats) {
    getDb().users[actorUsername].stats.actions += 1;
    getDb().users[actorUsername].updatedAt = nowIso();
  }
  recordReplay(room, label);
  applyStats(room);
  saveDb({ backup: room.status === "finished" });
  scheduleBattleAutomation(room);
}

function scheduleAiIfNeeded(room, delay = aiDelayMs) {
  if (!room?.code || !room.battle || room.status !== "playing") return;
  const engine = BattleEngine.fromSnapshot(room.battle, room.mode);
  const current = engine.currentFighter();
  if (!current || !isAiUsername(current.username) || engine.gameOver) return;
  const code = room.code.toUpperCase();
  if (aiTimers.has(code)) return;
  const timer = setTimeout(() => {
    aiTimers.delete(code);
    try {
      const liveRoom = getDb().rooms[code];
      if (!liveRoom?.battle || liveRoom.status !== "playing") return;
      const liveEngine = BattleEngine.fromSnapshot(liveRoom.battle, liveRoom.mode);
      const liveCurrent = liveEngine.currentFighter();
      if (!liveCurrent || !isAiUsername(liveCurrent.username) || liveEngine.gameOver) return;
      liveEngine.takeAction(aiTargets(liveEngine));
      finishAutomatedStep(liveRoom, liveEngine, "AI 行动");
    } catch (error) {
      console.error(`AI turn failed for room ${code}:`, error);
    }
  }, Math.max(200, delay));
  timer.unref?.();
  aiTimers.set(code, timer);
}

function applyHumanTimeout(room) {
  if (!room?.battle || room.status !== "playing") return false;
  const engine = BattleEngine.fromSnapshot(room.battle, room.mode);
  const current = engine.currentFighter();
  if (!current || isAiUsername(current.username) || engine.gameOver) return false;
  const deadline = Date.parse(engine.pendingAction?.expiresAt || engine.actionDeadlineAt || 0);
  if (!deadline || deadline > Date.now()) return false;
  engine.log(`${current.displayName} 思考超时，系统自动行动。`, "#e54866");
  if (engine.pendingAction) engine.resolvePendingAction(aiTargets(engine));
  else engine.takeAction(aiTargets(engine));
  finishAutomatedStep(room, engine, "思考超时", current.username);
  return true;
}

function scheduleHumanTimeout(room) {
  if (!room?.code || !room.battle || room.status !== "playing") return;
  const engine = BattleEngine.fromSnapshot(room.battle, room.mode);
  const current = engine.currentFighter();
  if (!current || isAiUsername(current.username) || engine.gameOver) {
    clearTurnTimer(room.code);
    return;
  }
  const deadline = Date.parse(engine.pendingAction?.expiresAt || engine.actionDeadlineAt || 0);
  if (!deadline) return;
  const code = room.code.toUpperCase();
  clearTurnTimer(code);
  if (deadline <= Date.now()) {
    applyHumanTimeout(room);
    return;
  }
  const timer = setTimeout(() => {
    turnTimers.delete(code);
    try {
      const liveRoom = getDb().rooms[code];
      if (applyHumanTimeout(liveRoom)) return;
      scheduleBattleAutomation(liveRoom);
    } catch (error) {
      console.error(`Turn timeout failed for room ${code}:`, error);
    }
  }, Math.max(0, deadline - Date.now() + 40));
  timer.unref?.();
  turnTimers.set(code, timer);
}

function scheduleBattleAutomation(room) {
  if (!room?.battle || room.status !== "playing") {
    clearTurnTimer(room?.code);
    return;
  }
  scheduleAiIfNeeded(room);
  scheduleHumanTimeout(room);
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
    id: `${room.code}-${Date.now()}`,
    code: room.code,
    mode: room.mode,
    finishedAt: nowIso(),
    participants,
    winners: [...winners],
    players: (room.battle.players || []).map((player) => ({
      username: player.username,
      playerName: player.playerName,
      characterName: player.characterName,
      team: player.team,
      health: player.health,
    })),
    replay: room.replay || [],
  });
  db.matches = db.matches.slice(0, 200);
  room.statsApplied = true;
}

function actRoom(room, username, targets) {
  applyHumanTimeout(room);
  if (!canAct(room, username)) throw httpError(403, "现在不是你的行动。");
  const engine = BattleEngine.fromSnapshot(room.battle, room.mode);
  engine.takeAction(targets || {});
  room.battle = engine.clone();
  room.status = room.battle.gameOver ? "finished" : "playing";
  room.updatedAt = nowIso();
  getDb().users[username].stats.actions += 1;
  getDb().users[username].updatedAt = nowIso();
  recordReplay(room, "行动结算");
  applyStats(room);
  saveDb({ backup: room.status === "finished" });
  scheduleBattleAutomation(room);
  return room;
}

function rollRoom(room, username) {
  applyHumanTimeout(room);
  if (!canAct(room, username)) throw httpError(403, "现在不是你的行动。");
  const engine = BattleEngine.fromSnapshot(room.battle, room.mode);
  engine.rollPendingAction();
  room.battle = engine.clone();
  room.updatedAt = nowIso();
  recordReplay(room, "触发技能");
  saveDb();
  scheduleBattleAutomation(room);
  return room;
}

function resolveRoom(room, username, targets) {
  applyHumanTimeout(room);
  if (!canAct(room, username)) throw httpError(403, "现在不是你的行动。");
  const engine = BattleEngine.fromSnapshot(room.battle, room.mode);
  engine.resolvePendingAction(targets || {});
  room.battle = engine.clone();
  room.status = room.battle.gameOver ? "finished" : "playing";
  room.updatedAt = nowIso();
  getDb().users[username].stats.actions += 1;
  getDb().users[username].updatedAt = nowIso();
  recordReplay(room, "选择目标");
  applyStats(room);
  saveDb({ backup: room.status === "finished" });
  scheduleBattleAutomation(room);
  return room;
}

function actAiRoom(room) {
  if (!room.battle || room.status !== "playing") throw httpError(409, "Battle is not running.");
  const engine = BattleEngine.fromSnapshot(room.battle, room.mode);
  const current = engine.currentFighter();
  if (!current || !isAiUsername(current.username)) throw httpError(409, "Current fighter is not AI.");
  engine.takeAction(aiTargets(engine));
  room.battle = engine.clone();
  room.status = room.battle.gameOver ? "finished" : "playing";
  room.updatedAt = nowIso();
  recordReplay(room, "AI 行动");
  applyStats(room);
  saveDb({ backup: room.status === "finished" });
  scheduleBattleAutomation(room);
  return room;
}

function resetRoom(room, username) {
  if (room.host !== username) throw httpError(403, "只有房主可以重开。");
  clearTurnTimer(room.code);
  room.status = roomStatus({ ...room, status: "waiting" });
  room.battle = null;
  room.replay = [];
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
    const matches = (getDb().matches || [])
      .filter((match) => (match.participants || []).includes(session.username))
      .slice(0, 30)
      .map(matchSummary);
    return json(res, 200, { ok: true, user: publicUser(session.user), rooms: myRooms, matches });
  }

  const matchDetail = path.match(/^\/api\/matches\/([^/]+)$/);
  if (req.method === "GET" && matchDetail) {
    const id = decodeURIComponent(matchDetail[1]);
    const match = (getDb().matches || []).find((item) => item.id === id || `${item.code}-${item.finishedAt}` === id);
    if (!match) return fail(res, 404, "战绩不存在。");
    if (!(match.participants || []).includes(session.username)) return fail(res, 403, "只能查看自己的作战记录。");
    return json(res, 200, { ok: true, match: publicMatch(match) });
  }

  if (req.method === "GET" && path === "/api/rooms") {
    Object.values(getDb().rooms).forEach((room) => scheduleBattleAutomation(room));
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

  const roomMatch = path.match(/^\/api\/rooms\/([A-Z0-9]{5})(?:\/([a-z-]+))?$/i);
  if (roomMatch) {
    const code = roomMatch[1].toUpperCase();
    const action = roomMatch[2] || "";
    const room = getDb().rooms[code];
    if (!room) return fail(res, 404, "房间不存在。");

    if (req.method === "GET" && !action) {
      scheduleBattleAutomation(room);
      return json(res, 200, { ok: true, room: publicRoomFor(room, session.username) });
    }
    if (req.method === "POST" && action === "join") return json(res, 200, { ok: true, room: publicRoomFor(joinRoom(room, session.username, body.selections || body.selection), session.username) });
    if (req.method === "POST" && action === "ai") {
      if (room.host !== session.username) throw httpError(403, "Only host can add AI.");
      const count = body.fill ? room.seats.filter((seat) => !seat.occupied).length : Number(body.count || 1);
      return json(res, 200, { ok: true, room: publicRoomFor(addAi(room, Math.max(1, count)), session.username) });
    }
    if (req.method === "POST" && action === "selection") return json(res, 200, { ok: true, room: publicRoomFor(applySelectionsToRoom(room, session.username, body.selections || body.selection), session.username) });
    if (req.method === "POST" && action === "start") return json(res, 200, { ok: true, room: publicRoomFor(startRoom(room, session.username), session.username) });
    if (req.method === "POST" && action === "roll") return json(res, 200, { ok: true, room: publicRoomFor(rollRoom(room, session.username), session.username) });
    if (req.method === "POST" && action === "resolve") return json(res, 200, { ok: true, room: publicRoomFor(resolveRoom(room, session.username, body.targets), session.username) });
    if (req.method === "POST" && action === "action") return json(res, 200, { ok: true, room: publicRoomFor(actRoom(room, session.username, body.targets), session.username) });
    if (req.method === "POST" && action === "ai-turn") return json(res, 200, { ok: true, room: publicRoomFor(actAiRoom(room), session.username) });
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
