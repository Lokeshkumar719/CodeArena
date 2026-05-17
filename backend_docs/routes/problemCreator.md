# File Purpose

Express router for problem CRUD (admin) and problem reads / user progress (authenticated). Mounted at `/problem` in `index.js`.

# Responsibilities

- Bind admin-only create/update/delete and admin detail fetch
- Bind user-facing problem list, detail, solved list, and per-problem submission history
- Separate middleware: `adminMiddleware` vs `userMiddleware`

# Main Functions / Components / Classes

| Route | Middleware | Controller |
|-------|------------|------------|
| `POST /create` | `adminMiddleware` | `createProblem` |
| `PUT /update/:id` | `adminMiddleware` | `updateProblem` |
| `DELETE /delete/:id` | `adminMiddleware` | `deleteProblem` |
| `GET /admin/problemById/:id` | `adminMiddleware` | `getProblemByIdAdmin` |
| `GET /problemById/:id` | `userMiddleware` | `getProblemById` |
| `GET /getAllProblems` | `userMiddleware` | `getAllProblems` |
| `GET /problemSolvedByUser` | `userMiddleware` | `solvedProblems` |
| `GET /problemSubmmision/:id` | `userMiddleware` | `submittedProblem` |

Export: `problemRouter`.

# Internal Logic

- Admin routes validate reference solutions via Judge0 before persisting (in controller).
- User routes omit `hiddenTestCases` in `getProblemById` select (controller-level).
- Submission history route param `:id` is **problem** id (not submission id); path typo: `problemSubmmision`.

# Inputs and Outputs

| Endpoint | Query/Params | Notes |
|----------|--------------|-------|
| `GET /getAllProblems` | `page`, `limit` (default 5) | Paginated list |
| `GET /problemById/:id` | problem id | May include video URLs |
| `GET /problemSolvedByUser` | — | Uses `req.result._id` |
| `GET /problemSubmmision/:id` | problem id | Returns submission array |

# Dependencies

**Internal:** `../controllers/problemsControllers`, `../middlewares/adminMiddleware`, `../middlewares/userMiddleware`

# Used By

- [../config/index.md](../config/index.md)
- Frontend: `Homepage.jsx`, `ProblemPage.jsx`, `SubmissionHistory.jsx`, admin components

# API Connections

See [../docs/API_FLOW.md](../docs/API_FLOW.md) sections 4, 6, 7, 8.

# Database Connections

`Problem`, `Submission`, `SolutionVideo`, `User` (via controllers).

# State/Context Dependencies

- `req.result` from middleware (admin or broken user middleware)
- Admin writes set `problemCreator` from `req.result._id` in controller

# Related Files

- [../controllers/problemsControllers.md](../controllers/problemsControllers.md)
- [../middleware/adminMiddleware.md](../middleware/adminMiddleware.md)
- [../middleware/userMiddleware.md](../middleware/userMiddleware.md)
- [../database/problems.md](../database/problems.md)
- [../database/submission.md](../database/submission.md)

# Next Files To Read

1. [../controllers/problemsControllers.md](../controllers/problemsControllers.md)
2. [../database/problems.md](../database/problems.md)

# Common Risks / Notes

- Typo in route: `problemSubmmision` (three m's) — clients must match exactly.
- User routes blocked for non-admins if `userMiddleware` bug unfixed.
- `createProblem` body includes typo field `problemCreater` in controller destructuring but schema uses `problemCreator`.

# Last Reviewed: 2026-05-18
