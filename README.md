# JLabs API (SQLite)

A Node.js + Express API using better-sqlite3 for simple, file-based local storage.
Handles user registration, login (with bcrypt password hashing), and fetching the current user.

---

## 📋 Requirements

* Node.js v18+ (LTS recommended)

---

## 🚀 Setup & Run (Local)

1. **Clone the repo**

```bash
git clone https://github.com/francoduenas11/api-repo
cd api-repo
```

2. **Install dependencies**

```bash
npm install
npm install --save-dev nodemon   # ensures dev script works everywhere
```

3. **Environment variables** Create a `.env` file in the project root (do not commit `.env`):

```env
PORT=4000
JWT_SECRET=change_me
FRONTEND_ORIGIN=http://localhost:5173
DATABASE_PATH=./data/dev.db
```

4. **Database setup** No server setup required - a SQLite file will be created automatically. The API will create necessary tables and data on first run.

5. **Run the API**

```bash
npm run dev
```

Server will start at: `http://localhost:4000`

---

## 🧪 Test User (if seeded in code)

If the app seeds a default account on startup:

* Email: `test@example.com`
* Password: `Password123!`

---

## 📚 API Endpoints

* `POST /auth/register` -> `{ token, user }`
* `POST /auth/login` -> `{ token, user }`
* `GET /auth/me` -> `{ user }` (requires `Authorization: Bearer <token>`)

---

## 🔒 Notes

* No external DB server needed - good for quick local testing.
* Keep `.env` listed in `.gitignore`. Track `.env.example` only as a template.
* CORS is restricted to `FRONTEND_ORIGIN` from `.env`.
* If a secret was committed, rotate it and remove it from history.
