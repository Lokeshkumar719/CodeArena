# File Purpose

Express router responsible for authentication, session validation, admin registration, logout, and password management routes.

**Documented Source File:** `backend/src/routes/auth/authRoutes.js`

Mounted at **`/user`** in `backend/src/index.js`.

# Responsibilities

- Map authentication endpoints to controller handlers
- Apply middleware-based authentication and authorization
- Protect session-dependent routes
- Expose session validation endpoint (`GET /user/check`)

# Authentication Architecture

Authentication and authorization are intentionally separated.

## authMiddleware

Responsible for:
- JWT verification
- Fetching authenticated user document
- Attaching `req.user`

## adminMiddleware

Responsible for authorization (`req.user.role === "admin"`).

# Main Functions / Components / Classes

| Route | Middleware | Handler |
|-------|------------|---------|
| POST /register | limitRegister | register |
| POST /login | limitLogin | login |
| POST /logout | authMiddleware | logout |
| POST /refresh | none | refreshAccessToken |
| POST /forgot-password | limitLogin | forgotPassword |
| POST /reset-password/:token | none | resetPassword |
| GET /verify-email/:token | none | verifyEmail |
| POST /change-password | authMiddleware, limitChangePassword | changePassword |
| POST /resend-verification | limitLogin | resendVerificationEmail |
| POST /admin/Register | authMiddleware, adminMiddleware | adminRegister |
| DELETE /profile | authMiddleware | deleteProfile |
| GET /check | authMiddleware | check session handler (inline) |

# Dependencies

- [../../controllers/auth/authController.md](../../controllers/auth/authController.md)
- [../../middlewares/auth/authMiddleware.md](../../middlewares/auth/authMiddleware.md)
- [../../middlewares/auth/adminMiddleware.md](../../middlewares/auth/adminMiddleware.md)
- [../../middlewares/rateLimitMiddleware.md](../../middlewares/rateLimitMiddleware.md)

# Used By

- [../../config/index.md](../../config/index.md)

# Related Files

- [../../controllers/auth/authController.md](../../controllers/auth/authController.md)
- [../../middlewares/auth/authMiddleware.md](../../middlewares/auth/authMiddleware.md)

# Last Reviewed: 2026-08-10