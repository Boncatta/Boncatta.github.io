import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = resolve(process.env.BONCATTA_DATA_DIR || join(root, "server", "data"));
const dbFile = join(dataDir, "db.json");
const backupDir = join(dataDir, "backups");

function emptyDb() {
  return {
    version: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    users: {},
    sessions: {},
    rooms: {},
    matches: [],
  };
}

function ensureDataDir() {
  mkdirSync(dataDir, { recursive: true });
  mkdirSync(backupDir, { recursive: true });
}

function loadDb() {
  ensureDataDir();
  if (!existsSync(dbFile)) return emptyDb();
  try {
    const db = JSON.parse(readFileSync(dbFile, "utf8"));
    return {
      ...emptyDb(),
      ...db,
      users: db.users || {},
      sessions: db.sessions || {},
      rooms: db.rooms || {},
      matches: db.matches || [],
    };
  } catch {
    const broken = join(backupDir, `broken-${Date.now()}.json`);
    copyFileSync(dbFile, broken);
    return emptyDb();
  }
}

let db = loadDb();
let writes = 0;

function backupIfNeeded(force = false) {
  writes += 1;
  if (!force && writes % 12 !== 0) return;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  writeFileSync(join(backupDir, `db-${stamp}.json`), JSON.stringify(db, null, 2), "utf8");
}

export function saveDb(options = {}) {
  db.updatedAt = new Date().toISOString();
  ensureDataDir();
  writeFileSync(dbFile, JSON.stringify(db, null, 2), "utf8");
  backupIfNeeded(Boolean(options.backup));
}

export function getDb() {
  return db;
}

export function replaceDb(next) {
  db = next;
  saveDb({ backup: true });
}

export function pruneSessions() {
  const now = Date.now();
  let changed = false;
  for (const [token, session] of Object.entries(db.sessions)) {
    if (!session?.expiresAt || Date.parse(session.expiresAt) < now) {
      delete db.sessions[token];
      changed = true;
    }
  }
  if (changed) saveDb();
}
