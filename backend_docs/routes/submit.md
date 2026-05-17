# File Purpose

Express router for code execution against test cases (run vs full submit). Mounted at `/submission` in `index.js`.

# Responsibilities

- Protect both endpoints with `userMiddleware`
- Map `POST /submit/:id` and `POST /run/:id` to `userSubmission` controller
- `:id` is the problem MongoDB ObjectId

# Main Functions / Components / Classes

| Route | Middleware | Handler |
|-------|------------|---------|
| `POST /submit/:id` | `userMiddleware` | `submitCode` |
| `POST /run/:id` | `userMiddleware` | `runCode` |

Export: `submitRouter`.

# Internal Logic

Thin router: no inline logic. All Judge0 orchestration lives in [../controllers/userSubmission.md](../controllers/userSubmission.md).

- **submit:** visible + hidden test cases, persists `Submission`, updates `problemSolved` on accept
- **run:** visible test cases only, no DB submission record

# Inputs and Outputs

| Endpoint | Body | Response |
|----------|------|----------|
| `POST /submission/submit/:id` | `{ code, language }` | `201` — `accepted`, counts, `runtime`, `memory`, `error` |
| `POST /submission/run/:id` | `{ code, language }` | `201` — `success`, `testCases`, `runtime`, `memory`, etc. |

`language` must be one supported by [../utils/problemUtility.md](../utils/problemUtility.md) (`cpp`, `java`, `javascript`).

# Dependencies

**Internal:** `../controllers/userSubmission`, `../middlewares/userMiddleware`

# Used By

- [../config/index.md](../config/index.md)
- `frontend/src/pages/ProblemPage.jsx`

# API Connections

Judge0 via [../services/judge0Service.md](../services/judge0Service.md). Documented in [../docs/API_FLOW.md](../docs/API_FLOW.md) §5–6.

# Database Connections

Submit path: `Problem`, `Submission`, `User.problemSolved` update.

Run path: `Problem` read only.

# State/Context Dependencies

- `req.result` (user document) required for `userId` and `$addToSet` on solve

# Related Files

- [../controllers/userSubmission.md](../controllers/userSubmission.md)
- [../services/judge0Service.md](../services/judge0Service.md)
- [../middleware/userMiddleware.md](../middleware/userMiddleware.md)
- [../database/submission.md](../database/submission.md)

# Next Files To Read

1. [../controllers/userSubmission.md](../controllers/userSubmission.md)
2. [../services/judge0Service.md](../services/judge0Service.md)

# Common Risks / Notes

- Same `userMiddleware` admin-only bug blocks non-admin submit/run.
- Synchronous Judge0 polling in request thread — long-running requests under load.
- No rate limiting on expensive judge calls.

# Last Reviewed: 2026-05-18
