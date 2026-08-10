# File Purpose

Express router responsible for serving platform-wide statistics.

**Documented Source File:** `backend/src/routes/statsRoutes.js`

Mounted at `/api/stats` in `backend/src/index.js`.

# Responsibilities

- Expose `GET /api/stats` endpoint for retrieving user, problem, submission, and video counts.

# Main Functions / Components / Classes

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| GET | `/` | none | `getPlatformStats` |

# Dependencies

- [../controllers/statsController.md](../controllers/statsController.md)

# Used By

- [../config/index.md](../config/index.md)

# Last Reviewed: 2026-08-10
