import dotenv from 'dotenv';
dotenv.config();

const client = (process.env.DB_CLIENT || '').toLowerCase();
const isPg = client === 'pg' || !!process.env.DATABASE_URL;

let db = null;

/**
 * Shared SQL schema.
 */
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

export async function initDb() {
  if (isPg) {
    const { Pool } = await import('pg');
    const connectionString = process.env.DATABASE_URL;
    const ssl =
      /neon.tech|azure|heroku|render|railway/.test(connectionString || '')
        ? { rejectUnauthorized: false }
        : undefined;
    db = new Pool({ connectionString, ssl });
    await db.query(SCHEMA_SQL);
  } else {
    const { default: Database } = await import('better-sqlite3');
    const fs = await import('fs');
    const path = await import('path');
    const dbPath = process.env.DATABASE_PATH || './data/dev.db';
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    db = new Database(dbPath);
    db.exec(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`
    );
  }
}

export async function findUserByEmail(email) {
  if (isPg) {
    const { rows } = await db.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1 LIMIT 1',
      [email]
    );
    return rows[0] || null;
  }
  return db
    .prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?')
    .get(email);
}

export async function createUser({ name, email, password_hash }) {
  if (isPg) {
    const { rows } = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, password_hash]
    );
    return rows[0];
  }
  const stmt = db.prepare(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
  );
  const info = stmt.run(name, email, password_hash);
  return { id: info.lastInsertRowid, name, email };
}

export async function findUserById(id) {
  if (isPg) {
    const { rows } = await db.query(
      'SELECT id, name, email FROM users WHERE id = $1 LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }
  return db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(id);
}
