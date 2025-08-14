## 📂 api-repo/README.md

# JLabs API (SQLite)

A Node.js + Express API using better-sqlite3 for simple, file‑based local storage.  
Handles user registration, login (with bcrypt password hashing), and fetching the current user.

---

## 📋 Requirements
- Node.js v18+ (LTS recommended)

---

## 🚀 Setup & Run (Local)

1. **Clone the repo**
   ```bash
   git clone https://github.com/francoduenas11/api-repo
   cd api-repo

2. **Install dependencies**
    bash
    npm install
    npm install --save-dev nodemon   # ensures dev script works everywhere

3. **Environment variables** 
Create a .env file in the root:
    PORT=4000
    JWT_SECRET=change_me
    FRONTEND_ORIGIN=http://localhost:5173
    DATABASE_PATH=./data/dev.db

4. **Database setup**
    No server setup required — SQLite file will be created automatically.
    The API will create necessary tables/data on first run.

5. **Run the API**
    npm run dev
The server will start at: http://localhost:4000

---

## 🧪 Test User (if seeded in code)
If your app seeds a default account on startup:
    Email: test@example.com
    Password: Password123!

---

## 📚 API Endpoints
    POST /auth/register → { token, user }
    POST /auth/login → { token, user }
    GET /auth/me → { user } (requires Authorization: Bearer <token>)

---

## 🔒 Notes
No external DB server needed — great for quick local testing.

CORS restricted to FRONTEND_ORIGIN from .env.