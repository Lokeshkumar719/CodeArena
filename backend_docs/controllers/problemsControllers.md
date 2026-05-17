# File Purpose

Business logic for DSA problem lifecycle: admin CRUD with reference-solution validation, paginated listing, user-facing reads, solved-problem tracking, and submission history per problem.

# Responsibilities

- Validate reference solutions against visible test cases via Judge0 before create/update
- Persist and update `Problem` documents
- Return problem payloads with optional `SolutionVideo` fields
- Paginate all problems for homepage
- Populate user's `problemSolved` array
- Query submissions by user + problem

# Main Functions / Components / Classes

| Export | Purpose |
|--------|---------|
| `createProblem` | Judge0-validate each reference solution → `Problem.create` |
| `updateProblem` | Validate id + arrays → Judge0 → `findByIdAndUpdate` |
| `deleteProblem` | `findById` + `findByIdAndDelete` |
| `getProblemByIdAdmin` | Full admin fields + hidden tests + video |
| `getProblemById` | User view (no `hiddenTestCases` in select) + video |
| `getAllProblems` | Paginated `_id title difficulty tags` |
| `solvedProblems` | `User.populate('problemSolved')` |
| `submittedProblem` | `Submission.find({ userId, problemId })` |

All wrapped with `asyncHandler`.

# Internal Logic

### Reference solution validation (create/update)

For each `{ language, completeCode }` in `referenceSolution`:

1. `getLanguageById(language)` → Judge0 `language_id`
2. Build batch submissions from `visibleTestCases` only
3. `submitBatch` → tokens → `submitToken` poll
4. Loop results: **`test.status_id !== JUDGE0_STATUS.ACCEPTED`** → reject

**Note:** `userSubmission.js` compares `test.status.id`; this file uses `test.status_id`. Judge0 batch GET with `fields: *` typically returns nested `status.id` — verify at runtime; mismatch may cause false failures or skipped checks.

### createProblem

- Sets `problemCreator: req.result._id` in `Problem.create({ ...req.body, problemCreator })`
- Destructures unused `problemCreater` from body (typo, ignored)
- On Judge0 failure returns `400` with `"Error Occured"` (generic)

### getProblemById vs admin

| Field | User | Admin |
|-------|------|-------|
| `hiddenTestCases` | omitted | included |
| `referenceSolution` | included in select | included |

Both merge Cloudinary video fields when `SolutionVideo` exists.

### getAllProblems

- Defaults: `page=1`, `limit=5`
- Returns `404` if zero problems (including empty DB)

# Inputs and Outputs

| Handler | Key inputs | Response |
|---------|------------|----------|
| `createProblem` | Full problem body | `200` text or `400` |
| `updateProblem` | `req.params.id`, body | `200` updated doc or errors |
| `deleteProblem` | `id` | `200` text |
| `getProblemById*` | `id` | Problem object ± video |
| `getAllProblems` | `page`, `limit` | `{ problems, currentPage, totalPages, totalProblems }` |
| `solvedProblems` | `req.result._id` | Array of problems |
| `submittedProblem` | `req.params.id` (problem) | Submission array or `[]` |

# Dependencies

**Internal:** `../utils/problemUtility`, `../services/judge0Service`, `../constants/judgeStatus`, `../models/problems`, `../models/user`, `../models/submission`, `../models/solutionVideo`, `../utils/asyncHandler`

**npm:** `mongoose`

# Used By

- [../routes/problemCreator.md](../routes/problemCreator.md)

# API Connections

Judge0 CE via [../services/judge0Service.md](../services/judge0Service.md).

# Database Connections

- `Problem` — CRUD
- `SolutionVideo` — read by `problemId`
- `User` — read/populate for solved list
- `Submission` — read for history

# State/Context Dependencies

- `req.result` from admin or user middleware
- Admin create uses `req.result._id` as creator

# Related Files

- [../routes/problemCreator.md](../routes/problemCreator.md)
- [../database/problems.md](../database/problems.md)
- [../services/judge0Service.md](../services/judge0Service.md)
- [../constants/judgeStatus.md](../constants/judgeStatus.md)

# Next Files To Read

1. [../database/problems.md](../database/problems.md)
2. [../services/judge0Service.md](../services/judge0Service.md)

# Common Risks / Notes

- `status_id` vs `status.id` inconsistency with Judge0 response shape.
- `createProblem` does not validate required body fields before Judge0 (may throw).
- No transaction if Judge0 passes but `Problem.create` fails.
- `getAllProblems` 404 on empty list may surprise clients expecting `200` + empty array.

# Last Reviewed: 2026-05-18
