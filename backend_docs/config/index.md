# File Purpose

Express application entry point for the CodeArena backend. Boots middleware, mounts HTTP routers, connects MongoDB and Redis in parallel, then starts the HTTP server on `process.env.PORT`.

**Documented Source File:** `backend/src/index.js`

# Responsibilities

- Load environment variables via `dotenv`
- Configure CORS for the frontend origin with credentials
- Parse JSON bodies and cookies
- Mount route prefixes: `/user`, `/problem`, `/submission`, `/video`, `/profile`, `/api`
- Register global error handler as the final middleware
- Orchestrate startup: `mongoose.connect` + `redis.connect`, then `app.listen`

# Main Functions / Components / Classes

| Symbol | Type | Description |
|--------|------|-------------|
| `app` | `express.Application` | Main Express instance |
| `initialiseConnection` | `async function` | Connects DB + Redis, starts server on success |
| (side effect) | IIFE call | `initialiseConnection()` runs at module load |

# Internal Logic

1. `require('dotenv').config()` runs first.
2. Middleware order: `cors` → `express.json()` → `cookieParser()` → routers → `errorMiddleware`.
3. `initialiseConnection` uses `Promise.all([main(), redisClient.connect()])` where `main` is the default export from `config/db.js` (Mongoose connect).
4. On success, logs `"DB connected"` and listens on `process.env.PORT`.
5. On failure, logs `"Error Occurred: "` + error.

# Inputs and Outputs

| Input | Source |
|-------|--------|
| `process.env.PORT` | Environment |
| `process.env.DB_CONNECT_STRING` | Used indirectly via `db.js` |
| `process.env.REDIS_URL` | Used indirectly via `redis.js` |
| HTTP requests | Clients |

| Output | Description |
|--------|-------------|
| HTTP responses | Via mounted routers |
| Console logs | Connection and listen messages |

# Dependencies

**npm:** `dotenv`, `express`, `cors`, `cookie-parser`

**Internal modules:**

- `./config/db` — MongoDB connection function
- `./config/redis` — Redis client (`.connect()` at startup)
- `./routes/auth/authRoutes` — Auth routes (`/user`)
- `./routes/problem/problemRoutes` — Problem routes (`/problem`)
- `./routes/submission/submissionRoutes` — Submission routes (`/submission`)
- `./routes/video/videoRoutes` — Solution video routes (`/video`)
- `./routes/profile/profileRoutes` — Profile routes (`/profile`)
- `./routes/statsRoutes` — Platform statistics routes (`/api`)
- `./middlewares/errorMiddleware`

# Used By

- **Process entry:** `package.json` scripts `"start"` and `"dev"` run `node src/index.js` / `nodemon src/index.js`
- Not imported by other backend modules

# API Connections

Exposes no routes directly; delegates to child routers:

| Mount | Router |
|-------|--------|
| `/user` | `routes/auth/authRoutes.js` |
| `/problem` | `routes/problem/problemRoutes.js` |
| `/submission` | `routes/submission/submissionRoutes.js` |
| `/video` | `routes/video/videoRoutes.js` |
| `/profile` | `routes/profile/profileRoutes.js` |
| `/api` | `routes/statsRoutes.js` |

# Database Connections

- Triggers MongoDB connection through `config/db.js` → `mongoose.connect(process.env.DB_CONNECT_STRING)`
- Triggers Redis connection through `config/redis.js` → `redisClient.connect()`

# State/Context Dependencies

- Requires `.env` with `PORT`, `DB_CONNECT_STRING`, `REDIS_URL`
- No in-memory application state beyond Express and shared Mongoose/Redis singletons

# Related Files

- [db.md](./db.md)
- [redis.md](./redis.md)
- [../routes/auth/authRoutes.md](../routes/auth/authRoutes.md)
- [../routes/problem/problemRoutes.md](../routes/problem/problemRoutes.md)
- [../routes/submission/submissionRoutes.md](../routes/submission/submissionRoutes.md)
- [../routes/video/videoRoutes.md](../routes/video/videoRoutes.md)
- [../routes/profile/profileRoutes.md](../routes/profile/profileRoutes.md)
- [../routes/statsRoutes.md](../routes/statsRoutes.md)
- [../middlewares/errorMiddleware.md](../middlewares/errorMiddleware.md)

# Next Files To Read

1. [../routes/auth/authRoutes.md](../routes/auth/authRoutes.md) — auth HTTP surface
2. [db.md](./db.md) and [redis.md](./redis.md) — connection config
3. [../middlewares/errorMiddleware.md](../middlewares/errorMiddleware.md) — global error shape

# Common Risks / Notes

- Startup failure logs to console.
- `errorMiddleware` must remain last; order of `app.use` calls is security- and behavior-critical.

# Last Reviewed: 2026-08-10
