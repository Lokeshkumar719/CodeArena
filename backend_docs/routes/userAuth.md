# File Purpose

Express router for user authentication and profile endpoints. Mounted at `/user` in `index.js`.

# Responsibilities

- Wire HTTP methods and paths to `userAuthenticate` controller handlers
- Apply `userMiddleware` or `adminMiddleware` where routes require an authenticated session
- Expose a lightweight inline handler for session validation (`GET /check`)

# Main Functions / Components / Classes

| Route | Middleware | Handler |
|-------|------------|---------|
| `POST /register` | none | `register` |
| `POST /login` | none | `login` |
| `POST /logout` | `userMiddleware` | `logout` |
| `POST /admin/Register` | `adminMiddleware` | `adminRegister` |
| `DELETE /profile` | `userMiddleware` | `deleteProfile` |
| `GET /check` | `userMiddleware` | inline — returns `{ user, message }` |

Export: `authRouter` (default module export).

# Internal Logic

- Public routes: register, login (no cookie verification).
- Protected routes use `userMiddleware` from `middlewares/userMiddleware.js` (see critical bug in [../middleware/userMiddleware.md](../middleware/userMiddleware.md)).
- Admin registration requires existing admin session via `adminMiddleware`.
- `GET /check` builds a reduced user object: `firstName`, `emailId`, `_id`, `role` from `req.result`.

# Inputs and Outputs

| Endpoint | Request | Response (typical) |
|----------|---------|-------------------|
| `POST /user/register` | Body: user fields | `201` + `{ user, message }` + `Set-Cookie: token` |
| `POST /user/login` | `{ emailId, password }` | `201` + user + cookie |
| `POST /user/logout` | Cookie `token` | `200` text, cookie cleared |
| `POST /user/admin/Register` | Body + admin cookie | `201` text + admin cookie |
| `DELETE /user/profile` | Cookie | `200` text |
| `GET /user/check` | Cookie | `200` + `{ user, message: "valid user" }` |

# Dependencies

**npm:** `express`

**Internal:**

- `../controllers/userAuthenticate`
- `../middlewares/userMiddleware`
- `../middlewares/adminMiddleware`

# Used By

- [../config/index.md](../config/index.md) — `app.use('/user', authRouter)`

# API Connections

Consumed by frontend `authSlice.js` (`/user/register`, `/login`, `/check`, `/logout`). See [../docs/API_FLOW.md](../docs/API_FLOW.md) and [../docs/AUTH_FLOW.md](../docs/AUTH_FLOW.md).

# Database Connections

Indirect via controllers: `User` model, Redis on logout.

# State/Context Dependencies

- Expects `token` httpOnly cookie on protected routes
- Sets `req.result` via middleware before controller/inline handler

# Related Files

- [../auth/userAuthenticate.md](../auth/userAuthenticate.md)
- [../middleware/userMiddleware.md](../middleware/userMiddleware.md)
- [../middleware/adminMiddleware.md](../middleware/adminMiddleware.md)
- [../database/user.md](../database/user.md)
- [../docs/AUTH_FLOW.md](../docs/AUTH_FLOW.md)

# Next Files To Read

1. [../auth/userAuthenticate.md](../auth/userAuthenticate.md)
2. [../middleware/userMiddleware.md](../middleware/userMiddleware.md)

# Common Risks / Notes

- Route path `POST /admin/Register` uses mixed casing (`Register`).
- Commented-out `POST /getProfile` route remains in source as dead code.
- **`userMiddleware` currently enforces admin role** — regular users cannot use `/check`, `/logout`, or `/profile` as intended until fixed.
- `GET /check` is the frontend session bootstrap (`checkAuth` thunk).

# Last Reviewed: 2026-05-18
