# File Purpose

Express router responsible for code execution and code submission endpoints for coding problems.

**Documented Source File:** `backend/src/routes/submission/submissionRoutes.js`

Mounted at `/submission` in `backend/src/index.js`.

# Responsibilities

- Protect execution routes using authentication and rate-limiting middleware
- Route code execution requests to submission controllers
- Separate visible testcase execution (`run`) from full evaluation (`submit`)

# Authentication & Middleware

All submission routes require:
- `authMiddleware` (verifies JWT access token)
- Rate limiters (`limitRunCode` for `/run/:id`, `limitSubmitCode` for `/submit/:id`)

# Main Functions / Components / Classes

| Route | Middleware | Handler |
|-------|------------|---------|
| POST /submit/:id | authMiddleware, limitSubmitCode | submitCode |
| POST /run/:id | authMiddleware, limitRunCode | runCode |

# Dependencies

- [../../controllers/submission/submissionController.md](../../controllers/submission/submissionController.md)
- [../../middlewares/auth/authMiddleware.md](../../middlewares/auth/authMiddleware.md)
- [../../middlewares/rateLimitMiddleware.md](../../middlewares/rateLimitMiddleware.md)

# Used By

- [../../config/index.md](../../config/index.md)

# Related Files

- [../../controllers/submission/submissionController.md](../../controllers/submission/submissionController.md)
- [../../models/submission.md](../../models/submission.md)

# Last Reviewed: 2026-08-10