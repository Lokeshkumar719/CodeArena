# File Purpose

Controller for running user code against visible test cases and submitting code against complete test suites (visible + hidden test cases), while persisting submission history and updating solved-problem progress.

**Documented Source File:** `backend/src/controllers/submission/submissionController.js`

# Responsibilities

- Validate request body (code, language) and problem existence
- Map platform languages to Judge0 language IDs
- Orchestrate Judge0 batch submission + polling workflow via `executionService`
- Persist submission records during full submissions
- Update User `problemSolved` array on accepted submissions
- Aggregate runtime, memory usage, testcase counts, and final status

# Authentication Flow

All routes using this controller require:

- `authMiddleware` (verifies JWT and attaches authenticated user document to `req.user`)
- Rate limiting middleware (`limitRunCode` / `limitSubmitCode`)

# Main Functions / Components / Classes

| Export | Behavior |
|--------|----------|
| `submitCode` | Full testcase evaluation + Submission creation + solved-problem update |
| `runCode` | Visible testcase execution only, no DB persistence |

All controllers are wrapped using `asyncHandler`.

# Dependencies

- [../../models/problem.md](../../models/problem.md)
- [../../models/submission.md](../../models/submission.md)
- [../../services/execution/executionService.md](../../services/execution/executionService.md)
- [../../utils/asyncHandler.md](../../utils/asyncHandler.md)
- [../../constants/judgeStatus.md](../../constants/judgeStatus.md)

# Used By

- [../../routes/submission/submissionRoutes.md](../../routes/submission/submissionRoutes.md)

# Related Files

- [../../routes/submission/submissionRoutes.md](../../routes/submission/submissionRoutes.md)
- [../../models/submission.md](../../models/submission.md)
- [../../services/execution/judge0Service.md](../../services/execution/judge0Service.md)

# Last Reviewed: 2026-08-10