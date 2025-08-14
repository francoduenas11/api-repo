# JLabs API (Node + Express)

A minimal auth API for Register, Login, and Me endpoints with SQLite (dev) and Postgres (prod).

## Features
- Register, Login, Me
- Bcrypt password hashing
- JWT auth (Bearer token)
- SQLite locally, Postgres in production
- CORS restricted by origin

## Requirements
- Node 18.x

## Setup (local dev)
1. cp .env.example .env
2. npm install
3. npm run migrate   # optional, auto-migrate runs on start
4. npm run seed
5. npm run dev

Default seed user:
- Email: test@example.com
- Password: Password123!

## Environment variables
- PORT=4000
- JWT_SECRET=change_me
- FRONTEND_ORIGIN=http://localhost:5173
- DATABASE_PATH=./data/dev.db
- DB_CLIENT=sqlite   # or pg
- DATABASE_URL=postgres://user:pass@host:port/dbname  # for pg

## Scripts
- npm run dev
- npm start
- npm run migrate
- npm run seed

## Endpoints
- POST /auth/register { name, email, password } -> { token, user }
- POST /auth/login { email, password } -> { token, user }
- GET /auth/me (Authorization: Bearer <token>) -> { user }

## Deployment (production)
- Set DB_CLIENT=pg and DATABASE_URL
- Set FRONTEND_ORIGIN to your Vercel web URL
- Set JWT_SECRET to a strong random value
- Start: npm start

## Notes on auth
- Passwords hashed with bcrypt (cost 10)
- JWT expires in 7 days; store in localStorage for this demo. In production, prefer httpOnly cookies.
