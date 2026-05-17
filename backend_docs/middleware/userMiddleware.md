# File Purpose

**Intended:** Express middleware to authenticate any logged-in user (JWT cookie + Redis blocklist + DB user lookup).

**Actual (critical bug):** This file implements **admin-only** authentication logic, identical in checks to [adminMiddleware.md](./adminMiddleware.md).

# Responsibilities

What the file **should** do (per route comments in `userAuth.js`):

- Verify `token` cookie JWT
- Reject blocklisted tokens in Redis
- Attach user document to `req.result` for any valid `user` or `admin` role

What the file **currently** does:

- Require `payload.role === 'admin'`
- Require `result.role === 'admin'` in MongoDB
- Reject all non-admin users with `401 Invalid Token-Not an admin`

# Main Functions / Components / Classes

| Export name in file | Exported as module |
|---------------------|-------------------|
| Internal const named `adminMiddleware` | `module.exports = adminMiddleware` |

Wrapped with [../utils/asyncHandler.md](../utils/asyncHandler.md) (unlike `adminMiddleware.js`).

# Internal Logic

1. Read `req.cookies.token`; missing → `401 Unauthorized Access`
2. `jwt.verify(token, process.env.JWT_KEY)`
3. Validate `payload.id` exists
4. **`if (payload.role !== 'admin')` → `401 Invalid Token-Not an admin`**
5. `User.findById(id)`; missing → `401 Admin Not Found`
6. **`if (result.role !== 'admin')` → `401 Invalid Token-User is not an admin`**
7. `redisClient.exists('token:${token}')` → blocked → `401 Invalid Token`
8. `req.result = result`; `next()`

No branch allows `role: "user"`.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `req.cookies.token` | On success: `req.result` = Mongoose user doc, `next()` |
| — | On failure: `401` plain text body (various messages) |

# Dependencies

**npm:** `jsonwebtoken`

**Internal:** `../models/user`, `../config/redis`, `../utils/asyncHandler`

# Used By

Imported as `userMiddleware` in:

- [../routes/userAuth.md](../routes/userAuth.md) — `/logout`, `/profile`, `/check`
- [../routes/problemCreator.md](../routes/problemCreator.md) — all user read routes
- [../routes/submit.md](../routes/submit.md) — submit and run

# API Connections

None directly. Gates access to most authenticated REST endpoints.

# Database Connections

- `User.findById`
- Redis `exists` on blocklist key

# State/Context Dependencies

- `process.env.JWT_KEY`
- Redis connected
- Misnamed export: file exports admin middleware under wrong import path

# Related Files

- [adminMiddleware.md](./adminMiddleware.md) — duplicate logic without `asyncHandler`
- [../routes/userAuth.md](../routes/userAuth.md)
- [../docs/AUTH_FLOW.md](../docs/AUTH_FLOW.md) — documents this issue

# Next Files To Read

1. [adminMiddleware.md](./adminMiddleware.md) — compare implementations
2. [../auth/userAuthenticate.md](../auth/userAuthenticate.md) — JWT issuance for users vs admins

# Common Risks / Notes

### Critical bug (verified 2026-05-18)

- **Symptom:** Regular users with valid `role: "user"` JWT receive `401` on `/user/check`, `/problem/*` reads, and `/submission/*`.
- **Root cause:** File content is admin middleware; variable inside file is even named `adminMiddleware`.
- **Fix direction:** Replace admin checks with: verify JWT, load user, ensure user exists, check Redis blocklist, **do not** require admin role. Keep admin checks only in `adminMiddleware.js`.

### Other notes

- Uses `asyncHandler`; rejected promises go to `errorMiddleware` (unlike sync returns in admin file).
- `jwt.verify` throws on invalid token — caught by `asyncHandler` → `500` unless error middleware distinguishes (currently generic 500).

# Last Reviewed: 2026-05-18
