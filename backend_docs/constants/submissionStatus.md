# `backend/src/constants/submissionStatus.js`

**Documented Source File:** `backend/src/constants/submissionStatus.js`  
**Purpose:** Application-level submission verdict strings stored in MongoDB.  
**Last reviewed:** 2026-08-10

## Exported Object: `SUBMISSION_STATUS`

| Constant | Value |
|----------|-------|
| `PENDING` | `'pending'` |
| `ACCEPTED` | `'accepted'` |
| `WRONG_ANSWER` | `'wrong answer'` |
| `COMPILATION_ERROR` | `'compilation error'` |
| `RUNTIME_ERROR` | `'runtime error'` |
| `TIME_LIMIT_EXCEEDED` | `'time limit exceeded'` |

## Notes

These are the canonical verdict strings written to `Submission.status` in MongoDB by [../services/execution/executionService.md](../services/execution/executionService.md).
