# File Purpose

Express global error-handling middleware (four-argument signature). Catches errors passed via `next(err)` from `asyncHandler`-wrapped controllers and returns structured error responses.

**Documented Source File:** `backend/src/middlewares/errorMiddleware.js`

# Responsibilities

- Log error to `console.error`
- Respond with `{ success: false, message }` and appropriate HTTP status code
- Handle Mongoose `ApiError` instances and duplicate key errors (11000)

# Main Functions / Components / Classes

| Export | Signature |
|--------|-----------|
| `errorMiddleware` | `(err, req, res, next) => void` |

# Internal Logic

1. Logs error.
2. Checks if `err` is instance of `ApiError` (uses `err.statusCode`).
3. Handles MongoDB duplicate key errors (code 11000) returning HTTP 409.
4. Defaults to HTTP 500 `'Internal Server Error'`.

# Dependencies

- [../utils/ApiError.md](../utils/ApiError.md)
- [../constants/statusCodes.md](../constants/statusCodes.md)

# Used By

- [../config/index.md](../config/index.md) — registered as final Express middleware

# Related Files

- [../utils/asyncHandler.md](../utils/asyncHandler.md)
- [../utils/ApiError.md](../utils/ApiError.md)

# Last Reviewed: 2026-08-10
