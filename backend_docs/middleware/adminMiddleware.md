# File Purpose

Express middleware that restricts routes to authenticated **admin** users. Verifies JWT cookie, confirms admin role in token and database, checks Redis logout blocklist, and sets `req.result`.

# Responsibilities

- Reject requests without `token` cookie
- Verify JWT with `JWT_KEY`
- Enforce `payload.role === 'admin'`
- Load user and enforce `result.role === 'admin'`
- Reject blocklisted tokens
- Attach full user document to `req.result`

# Main Functions / Components / Classes

| Export | Type |
|--------|------|
| `adminMiddleware` | `async (req, res, next) => { ... }` — **not** wrapped in `asyncHandler` |

# Internal Logic

Same step sequence as [userMiddleware.md](./userMiddleware.md) (which incorrectly duplicates this logic):

1. Cookie present
2. `jwt.verify`
3. `payload.id` present
4. `payload.role === 'admin'`
5. `User.findById(id)`
6. `result.role === 'admin'`
7. `redisClient.exists('token:${token}')`
8. `req.result = result`; `next()`

Returns `401` with plain text for all failures (no `next(err)`).

# Inputs and Outputs

| Input | Success |
|-------|---------|
| Valid admin JWT + active token | `req.result`, `next()` |

| Failure | Status | Message (examples) |
|---------|--------|-------------------|
| No cookie | 401 | Unauthorized Access |
| Wrong role | 401 | Invalid Token-Not an admin |
| Blocklisted | 401 | Invalid Token |

# Dependencies

**npm:** `jsonwebtoken`

**Internal:** `../models/user`, `../config/redis`

# Used By

- [../routes/userAuth.md](../routes/userAuth.md) — `POST /admin/Register`
- [../routes/problemCreator.md](../routes/problemCreator.md) — admin CRUD routes
- [../routes/videoCreator.md](../routes/videoCreator.md) — all video routes

# API Connections

None.

# Database Connections

`User.findById`; Redis blocklist check.

# State/Context Dependencies

- `process.env.JWT_KEY`
- Admin JWT must be obtained via `adminRegister` or login as admin user

# Related Files

- [userMiddleware.md](./userMiddleware.md) — erroneous duplicate
- [../auth/userAuthenticate.md](../auth/userAuthenticate.md)
- [../docs/AUTH_FLOW.md](../docs/AUTH_FLOW.md)

# Next Files To Read

1. [userMiddleware.md](./userMiddleware.md) — understand duplication bug
2. [../routes/problemCreator.md](../routes/problemCreator.md) — admin route map

# Common Risks / Notes

- Not wrapped in `asyncHandler`: `jwt.verify` throw or `User.findById` rejection may become unhandled rejection.
- Plain-text 401 bodies (not JSON) — frontend must not assume JSON on auth errors.
- No check that JWT `emailId` still matches DB email (immutable in schema).

# Last Reviewed: 2026-05-18
