# `backend/src/models/submission.js`

**Layer:** Model (Mongoose)  
**Documented Source File:** `backend/src/models/submission.js`  
**Purpose:** Mongoose schema and model for code submission attempts. Stores source code, language, judge outcome, and test-case statistics.  
**Last reviewed:** 2026-08-10

## Responsibilities

- Persist per-attempt submission records for history and analytics.
- Index `(userId, problemId)` for efficient history queries.
- Index `(userId, status)` for user statistics.
- Define allowed `language` and `status` enums.

## Schema Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `userId` | ObjectId | required, Ref: `user` | User who made the submission. |
| `problemId` | ObjectId | required, Ref: `Problem` | Problem being attempted. |
| `code` | String | required | The submitted source code. |
| `language` | String | required, enum: `['cpp', 'java', 'javascript']` | The programming language. |
| `status` | String | default: `pending`, enum | Execution verdict (see below). |
| `runtime` | Number | default: `0` | Max runtime across test cases (in seconds). |
| `memory` | Number | default: `0` | Max memory across test cases (in KB). |
| `testCasesPassed` | Number | default: `0` | Count of successfully passed test cases. |
| `testCasesTotal` | Number | default: `0` | Total number of test cases evaluated. |
| `errorMessage` | String | - | Aggregated or specific error message from Judge0. |
| `createdAt`, `updatedAt` | Date | auto | Timestamps managed by Mongoose. |

## Status Enum Values

- `pending`
- `accepted`
- `wrong_answer`
- `compile_error`
- `runtime_error`
- `time_limit_exceeded`
- `memory_limit_exceeded`
- `output_limit_exceeded`
- `internal_error`

## Dependencies

- `mongoose`

## Used By

- [../controllers/submission/submissionController.md](../controllers/submission/submissionController.md)
- [../controllers/problem/problemController.md](../controllers/problem/problemController.md) - for querying submission history

## Related Files

- [user.md](./user.md) - Cascade delete when user is deleted.
- [problem.md](./problem.md)
