# File Purpose

Express middleware responsible for authorization of authenticated admin users.

**Documented Source File:** `backend/src/middlewares/auth/adminMiddleware.js`

This middleware assumes authentication has already been completed by `authMiddleware` and verifies whether `req.user.role === "admin"`.

# Responsibilities

- Restrict protected routes to admin users only
- Return 403 Forbidden response for non-admin users
- Pass authorized admin requests to next middleware/controller

# Main Functions / Components / Classes

| Export | Type |
|--------|------|
| `adminMiddleware` | Express middleware function |

# Internal Logic

1. Verifies `req.user` exists and `req.user.role === "admin"`.
2. Throws `403 Forbidden` if user is not an admin.
3. Calls `next()` if user is an admin.

# Dependencies

- [../../utils/ApiError.md](../../utils/ApiError.md)

# Used By

- Admin routes across auth, problem, and video routers

# Related Files

- [authMiddleware.md](./authMiddleware.md)
- [../../controllers/auth/authController.md](../../controllers/auth/authController.md)

# Last Reviewed: 2026-08-10