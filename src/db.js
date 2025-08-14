import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DATABASE_PATH || './data/dev.db';
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export const db = new Database(dbPath);

// Auto-migrate users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

export function findUserByEmail(email) {
  return db.prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?').get(email);
}

export function createUser({ name, email, password_hash }) {
  const stmt = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
  const info = stmt.run(name, email, password_hash);
  return { id: info.lastInsertRowid, name, email };
}

export function findUserById(id) {
  return db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(id);
}
