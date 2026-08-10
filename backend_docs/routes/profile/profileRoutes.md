# File Purpose

Express router responsible for user profile management endpoints.

**Documented Source File:** `backend/src/routes/profile/profileRoutes.js`

Mounted at `/profile` in `backend/src/index.js`.

# Responsibilities

- Expose endpoints for viewing and updating user profiles.

# Main Functions / Components / Classes

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| GET | `/me` | `authMiddleware` | `getMyProfile` |
| PATCH | `/me` | `authMiddleware` | `updateMyProfile` |
| GET | `/:username` | none | `getPublicProfile` |

# Dependencies

- [../../controllers/profile/profileController.md](../../controllers/profile/profileController.md)
- [../../middlewares/auth/authMiddleware.md](../../middlewares/auth/authMiddleware.md)

# Used By

- [../../config/index.md](../../config/index.md)

# Last Reviewed: 2026-08-10
