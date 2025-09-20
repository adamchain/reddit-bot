import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'bot.db');

async function ensureDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  await db.exec(`CREATE TABLE IF NOT EXISTS dnc (username TEXT PRIMARY KEY)`);
  await db.exec(`CREATE TABLE IF NOT EXISTS dmqueue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    contextLink TEXT,
    added INTEGER
  )`);
  await db.exec(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts INTEGER,
    action TEXT,
    detail TEXT
  )`);
  return db;
}

export async function addDNC(username) {
  if (!username) return;
  const db = await ensureDB();
  await db.run('INSERT OR IGNORE INTO dnc(username) VALUES(?)', username.toLowerCase());
}

export async function isDNC(username) {
  if (!username) return false;
  const db = await ensureDB();
  const row = await db.get('SELECT username FROM dnc WHERE username=?', username.toLowerCase());
  return !!row;
}

export async function enqueueDM({ username, contextLink, added }) {
  const db = await ensureDB();
  await db.run('INSERT INTO dmqueue(username, contextLink, added) VALUES(?,?,?)',
    username, contextLink, added || Date.now());
}

export async function dueDMs(delayMs) {
  const db = await ensureDB();
  const cutoff = Date.now() - delayMs;
  return db.all('SELECT * FROM dmqueue WHERE added <= ?', cutoff);
}

export async function clearDM(id) {
  const db = await ensureDB();
  await db.run('DELETE FROM dmqueue WHERE id=?', id);
}

export async function logAction(action, detail) {
  const db = await ensureDB();
  await db.run('INSERT INTO logs(ts, action, detail) VALUES(?,?,?)',
    Date.now(), action, detail);
}

export async function dailySummary() {
  const db = await ensureDB();
  const since = Date.now() - 24*60*60*1000;
  return db.all('SELECT * FROM logs WHERE ts >= ?', since);
}
