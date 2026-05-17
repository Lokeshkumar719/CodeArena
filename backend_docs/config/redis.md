# File Purpose

Creates and exports a singleton Redis client used for JWT logout blocklisting and auth middleware token checks.

# Responsibilities

- Instantiate a Redis client with URL from environment
- Attach an `error` event listener that logs to `console.error`
- Export the client for `.connect()` at startup and for `exists` / `set` / `expireAt` in auth flows

# Main Functions / Components / Classes

| Export | Type | Description |
|--------|------|-------------|
| `redisClient` | `redis` package client | Created via `createClient({ url: process.env.REDIS_URL })` |

# Internal Logic

1. `require('dotenv').config()`
2. `createClient` from `redis` v5 with `{ url: process.env.REDIS_URL }`
3. `redisClient.on("error", ...)` logs `"Redis Error:"` + err
4. Module does **not** call `.connect()` itself — callers must connect (`index.js`, and implicitly before middleware use)

# Inputs and Outputs

| Input | Description |
|-------|-------------|
| `process.env.REDIS_URL` | Redis connection URL |

| Output | Description |
|--------|-------------|
| Exported client | Used for `connect`, `exists`, `set`, `expireAt` |

# Dependencies

**npm:** `dotenv`, `redis` (^5.10.0)

# Used By

- [index.md](./index.md) — `redisClient.connect()` on startup
- [../auth/userAuthenticate.md](../auth/userAuthenticate.md) — logout blocklist
- [../middleware/userMiddleware.md](../middleware/userMiddleware.md) — `exists('token:${token}')`
- [../middleware/adminMiddleware.md](../middleware/adminMiddleware.md) — same blocklist check

# API Connections

None directly. Supports auth HTTP flows documented in [../docs/AUTH_FLOW.md](../docs/AUTH_FLOW.md).

# Database Connections

- **Redis** key pattern: `token:<jwt_string>` — value `"blocked"` on logout, with `expireAt` aligned to JWT `exp`

# State/Context Dependencies

- Client must be connected before middleware/auth handlers run reliably; `index.js` connects before `listen`
- If Redis is down at runtime, `exists` / `set` in middleware may throw (not wrapped in try/catch in middleware)

# Related Files

- [index.md](./index.md)
- [../auth/userAuthenticate.md](../auth/userAuthenticate.md)
- [../middleware/adminMiddleware.md](../middleware/adminMiddleware.md)
- [../middleware/userMiddleware.md](../middleware/userMiddleware.md)
- [../docs/AUTH_FLOW.md](../docs/AUTH_FLOW.md)

# Next Files To Read

1. [../auth/userAuthenticate.md](../auth/userAuthenticate.md) — logout blocklist write path
2. [../middleware/adminMiddleware.md](../middleware/adminMiddleware.md) — blocklist read path

# Common Risks / Notes

- No reconnection strategy configured in this file.
- Blocklist depends on Redis availability; failures surface as 500 via unhandled rejections unless caught upstream.
- Key is the full JWT string (`token:${token}`), which can be long but is exact-match for revocation.

# Last Reviewed: 2026-05-18
