# File Purpose

Express router responsible for problem CRUD operations, problem retrieval, solved-problem tracking, and submission-history routes.

**Documented Source File:** `backend/src/routes/problem/problemRoutes.js`

Mounted at `/problem` in `backend/src/index.js`.

# Responsibilities

- Bind admin-only problem management routes (with ZIP testcase upload support via `uploadZipMiddleware`)
- Bind authenticated user-facing problem routes
- Apply middleware-based authentication, authorization, and rate limiting
- Route requests to appropriate controller handlers

# Authentication & Middleware

- `authMiddleware`: verifies JWT token
- `adminMiddleware`: verifies admin role
- `uploadZipMiddleware`: handles memory upload for testcase ZIP files
- `limitSubmitCode`: rate limits problem creation and updating

# Main Functions / Components / Classes

| Route | Middleware | Controller |
|-------|------------|------------|
| POST /create | authMiddleware, adminMiddleware, uploadZipMiddleware, limitSubmitCode | createProblem |
| PATCH /update/:id | authMiddleware, adminMiddleware, uploadZipMiddleware, limitSubmitCode | updateProblem |
| DELETE /delete/:id | authMiddleware, adminMiddleware | deleteProblem |
| GET /admin/problemById/:id | authMiddleware, adminMiddleware | getProblemByIdAdmin |
| GET /:slug | authMiddleware | getProblemBySlug |
| GET /getProblems | authMiddleware | getAllProblems |
| GET /problemSolvedByUser | authMiddleware | solvedProblems |
| GET /problemSubmmision/:id | authMiddleware | submittedProblem |

# Dependencies

- [../../controllers/problem/problemController.md](../../controllers/problem/problemController.md)
- [../../middlewares/auth/authMiddleware.md](../../middlewares/auth/authMiddleware.md)
- [../../middlewares/auth/adminMiddleware.md](../../middlewares/auth/adminMiddleware.md)
- [../../middlewares/uploadZipMiddleware.md](../../middlewares/uploadZipMiddleware.md)
- [../../middlewares/rateLimitMiddleware.md](../../middlewares/rateLimitMiddleware.md)

# Used By

- [../../config/index.md](../../config/index.md)

# Related Files

- [../../controllers/problem/problemController.md](../../controllers/problem/problemController.md)
- [../../models/problem.md](../../models/problem.md)

# Last Reviewed: 2026-08-10