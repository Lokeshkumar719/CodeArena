# File Purpose

Express application entry point for the CodeArena backend. Boots middleware, mounts HTTP routers, connects MongoDB and Redis in parallel, then starts the HTTP server on `process.env.PORT`.

# Responsibilities

- Load environment variables via `dotenv`
- Configure CORS for the Vite dev frontend (`http://localhost:5173`) with credentials
- Parse JSON bodies and cookies
- Mount route prefixes: `/user`, `/problem`, `/submission`, `/video`
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
5. On failure, logs `"Error Occurred: "` + error; **does not** call `process.exit` or start the server.

# Inputs and Outputs

| Input | Source |
|-------|--------|
| `process.env.PORT` | Environment |
| `process.env.DB_CONNECT_STRING` | Used indirectly via `db.js` |
| `process.env.REDIS_URL` | Used indirectly via `redis.js` |
| HTTP requests | Clients (frontend on port 5173) |

| Output | Description |
|--------|-------------|
| HTTP responses | Via mounted routers |
| Console logs | Connection and listen messages |

# Dependencies

**npm:** `dotenv`, `express`, `cors`, `cookie-parser`

**Internal modules:**

- `./config/db` — MongoDB connection function
- `./config/redis` — Redis client (`.connect()` at startup)
- `./routes/userAuth`, `problemCreator`, `submit`, `videoCreator`
- `./middlewares/errorMiddleware`

# Used By

- **Process entry:** `package.json` scripts `"start"` and `"dev"` run `node src/index.js` / `nodemon src/index.js`
- Not imported by other backend modules

# API Connections

Exposes no routes directly; delegates to child routers:

| Mount | Router |
|-------|--------|
| `/user` | `routes/userAuth.js` |
| `/problem` | `routes/problemCreator.js` |
| `/submission` | `routes/submit.js` |
| `/video` | `routes/videoCreator.js` |

See [../docs/API_FLOW.md](../docs/API_FLOW.md) for end-to-end client flows.

# Database Connections

- Triggers MongoDB connection through `config/db.js` → `mongoose.connect(process.env.DB_CONNECT_STRING)`
- Triggers Redis connection through `config/redis.js` → `redisClient.connect()`

# State/Context Dependencies

- Requires `.env` (or environment) with `PORT`, `DB_CONNECT_STRING`, `REDIS_URL` at minimum for a successful boot
- No in-memory application state beyond Express and shared Mongoose/Redis singletons

# Related Files

- [db.md](./db.md)
- [redis.md](./redis.md)
- [../routes/userAuth.md](../routes/userAuth.md)
- [../routes/problemCreator.md](../routes/problemCreator.md)
- [../routes/submit.md](../routes/submit.md)
- [../routes/videoCreator.md](../routes/videoCreator.md)
- [../middleware/errorMiddleware.md](../middleware/errorMiddleware.md)
- [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- [../docs/BACKEND_FLOW.md](../docs/BACKEND_FLOW.md)

# Next Files To Read

1. [../routes/userAuth.md](../routes/userAuth.md) — auth HTTP surface
2. [db.md](./db.md) and [redis.md](./redis.md) — connection config
3. [../middleware/errorMiddleware.md](../middleware/errorMiddleware.md) — global error shape

# Common Risks / Notes

- Startup failure only logs to console; the process may stay alive without listening.
- CORS `origin` is hardcoded to `http://localhost:5173` (not configurable via env).
- `helmet`, `morgan`, and `rate-limiter-flexible` are in `package.json` but **not** used here.
- No WebSocket server is mounted (see [../websocket/README.md](../websocket/README.md)).
- `errorMiddleware` must remain last; order of `app.use` calls is security- and behavior-critical.

# Last Reviewed: 2026-05-18
