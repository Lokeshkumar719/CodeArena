# File Purpose

Creates and exports a singleton Redis client used for refresh session management and rate limiting.

**Documented Source File:** `backend/src/config/redis.js`

# Responsibilities

- Instantiate a Redis client with URL from environment
- Attach an `error` event listener that logs to `console.error`
- Export the client for `.connect()` at startup and for session/rate-limit tracking throughout the backend

# Main Functions / Components / Classes

| Export | Type | Description |
|--------|------|-------------|
| `redisClient` | `redis` package client | Created via `createClient({ url: process.env.REDIS_URL })` |

# Internal Logic

1. `require('dotenv').config()`
2. `createClient` from `redis` with `{ url: process.env.REDIS_URL }`
3. `redisClient.on("error", ...)` logs `"Redis Error:"` + err
4. Module does **not** call `.connect()` itself — `backend/src/index.js` connects it at server startup

# Inputs and Outputs

| Input | Description |
|-------|-------------|
| `process.env.REDIS_URL` | Redis connection URL |

| Output | Description |
|--------|-------------|
| Exported client | Used for `connect`, `get`, `set`, `del`, and executing Lua scripts |

# Dependencies

**npm:** `dotenv`, `redis`

# Used By

- [index.md](./index.md) — `redisClient.connect()` on startup
- [../services/auth/refreshSessionService.md](../services/auth/refreshSessionService.md) — storing and invalidating hashed refresh token sessions
- [../middlewares/rateLimitMiddleware.md](../middlewares/rateLimitMiddleware.md) — Fixed Window and Token Bucket rate limiters
- [../utils/auth/authUtils.md](../utils/auth/authUtils.md) — removing refresh session on logout/password reset

# API Connections

None directly. Supports HTTP auth and rate-limiting flows.

# Database Connections

- **Redis** key patterns:
  - `refreshToken:<userId>` — SHA-256 hashed refresh token session
  - `rl:*` — IP and user rate limit counters and Token Bucket states

# State/Context Dependencies

- Client must be connected before auth refresh handlers or rate limiters run; `index.js` connects before `listen`
- If Redis is down, rate limiters fail-open (bypass), but token refresh operations fail to validate

# Related Files

- [index.md](./index.md)
- [../services/auth/refreshSessionService.md](../services/auth/refreshSessionService.md)
- [../middlewares/rateLimitMiddleware.md](../middlewares/rateLimitMiddleware.md)

# Next Files To Read

1. [../middlewares/rateLimitMiddleware.md](../middlewares/rateLimitMiddleware.md) — rate limiting implementation
2. [../services/auth/refreshSessionService.md](../services/auth/refreshSessionService.md) — refresh token session storage

# Common Risks / Notes

- No explicit reconnection strategy configured in this file.
- Downed Redis will allow rate limits to be bypassed but will block refresh token validation.

# Last Reviewed: 2026-08-10
