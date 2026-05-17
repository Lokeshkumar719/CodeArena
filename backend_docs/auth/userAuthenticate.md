# File Purpose

Controller module for user registration, login, logout, admin registration, and account deletion. Implements JWT-in-cookie auth and Redis logout blocklisting.

# Responsibilities

- Validate registration/admin bodies via `utils/validate`
- Hash passwords with bcrypt (cost 10)
- Issue JWT cookies (`httpOnly`, `sameSite: 'strict'`, 1 hour)
- Block revoked tokens in Redis on logout
- Delete user document on profile delete

# Main Functions / Components / Classes

| Export | Wrapped in `asyncHandler` | Role |
|--------|---------------------------|------|
| `register` | yes | Public signup, role forced to `"user"` |
| `login` | yes | Email/password verify, JWT role from DB |
| `logout` | yes | Redis blocklist + clear cookie |
| `adminRegister` | yes | Admin-only creation, role `"admin"` |
| `deleteProfile` | yes | `User.findByIdAndDelete(req.result._id)` |

# Internal Logic

### Register

1. `validate(req.body)` — mandatory fields, email, strong password, firstName length
2. `req.body.role = "user"`
3. `bcrypt.hash(password, 10)`
4. `User.create(req.body)`
5. `jwt.sign({ id, emailId, role: "user" }, JWT_KEY, { expiresIn: 3600 })` — **JWT role hardcoded `"user"`**, not `user.role`
6. Set cookie + `201` with sanitized `reply` object

### Login

1. Requires `emailId` and `password` or throws `"Invalid Credentials"`
2. `User.findOne({ emailId })`, `bcrypt.compare`
3. JWT payload uses `user.role` from database
4. Cookie + `201`

### Logout

1. Read `req.cookies.token`, `jwt.decode` for `exp`
2. `redisClient.set('token:${token}', 'blocked')` + `expireAt` at JWT exp
3. Clear cookie (`token: null`, immediate expiry)

### Admin register

Same as register but `role: "admin"` in body and JWT payload.

### Delete profile

Deletes user by `req.result._id`; submission cleanup relies on User model post-hook.

# Inputs and Outputs

| Handler | Input | Output |
|---------|-------|--------|
| `register` | `{ firstName, emailId, password, ... }` | Cookie + `{ user, message }` |
| `login` | `{ emailId, password }` | Cookie + user |
| `logout` | cookie | `"Logged Out Successfully"` |
| `adminRegister` | validated body | `"Admin Registered Successfully"` |
| `deleteProfile` | `req.result` | `"User deleted Successfully"` |

Errors throw `Error` → [../middleware/errorMiddleware.md](../middleware/errorMiddleware.md) → `500` with message.

# Dependencies

**npm:** `bcrypt`, `jsonwebtoken`

**Internal:** `../config/redis`, `../models/user`, `../utils/validate`, `../utils/asyncHandler`

**Note:** `../models/submission` is imported in source but **not used** in this file.

# Used By

- [../routes/userAuth.md](../routes/userAuth.md)

# API Connections

None external except Redis. JWT is local.

# Database Connections

- **MongoDB:** `User` collection create/find/delete
- **Redis:** token blocklist on logout

# State/Context Dependencies

- `process.env.JWT_KEY`
- `req.result` for logout/delete (set by middleware)
- `req.cookies.token` for logout

# Related Files

- [../routes/userAuth.md](../routes/userAuth.md)
- [../utils/validate.md](../utils/validate.md)
- [../database/user.md](../database/user.md)
- [../config/redis.md](../config/redis.md)
- [../docs/AUTH_FLOW.md](../docs/AUTH_FLOW.md)

# Next Files To Read

1. [../middleware/userMiddleware.md](../middleware/userMiddleware.md)
2. [../utils/validate.md](../utils/validate.md)

# Common Risks / Notes

- `login` / `register` contain `console.log` of credentials and user objects (security risk in production).
- Register JWT always says `role: "user"` even if DB role differed.
- `logout` uses `jwt.decode` not `verify` (acceptable after middleware already verified on protected route).
- `deleteProfile` does not explicitly clear Redis/cookie (caller typically logs out separately).
- Imported `submission` model is dead code.

# Last Reviewed: 2026-05-18
