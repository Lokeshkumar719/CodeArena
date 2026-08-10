# `backend/src/controllers/statsController.js`

**Layer:** Controller  
**Documented Source File:** `backend/src/controllers/statsController.js`  
**Purpose:** HTTP handler for platform-wide statistics.  
**Last reviewed:** 2026-08-10

> **Note:** This controller lives at `controllers/statsController.js` (not in a subdirectory), because it is a single-function controller.

## Exported Handlers

### `getPlatformStats` — `GET /api/stats`
- Public endpoint (no auth required).
- Runs four parallel `countDocuments()` queries across `User`, `Problem`, `Submission`, and `SolutionVideo`.
- Returns `{ users, problems, submissions, videos }`.

## Dependencies

- [../utils/asyncHandler.md](../utils/asyncHandler.md)
- [../models/user.md](../models/user.md)
- [../models/problem.md](../models/problem.md)
- [../models/submission.md](../models/submission.md)
- [../models/solutionVideo.md](../models/solutionVideo.md)
