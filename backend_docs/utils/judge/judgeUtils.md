# `backend/src/utils/judge/getSubmissionResult.js`

**Layer:** Utility  
**Documented Source File:** `backend/src/utils/judge/getSubmissionResult.js`  
**Purpose:** Maps raw Judge0 status codes to application-level verdict objects.  
**Last reviewed:** 2026-08-10

## Exported Function

### `getSubmissionResult(test)`
Accepts a single Judge0 submission result object (with `test.status.id`) and returns `{ status, errorMessage }`.

### Mapping

| Judge0 `status.id` | Returned `status` | Notes |
|---------------------|--------------------|-------|
| `ACCEPTED` (3) | `'accepted'` | — |
| `WRONG_ANSWER` (4) | `'wrong_answer'` | — |
| `TIME_LIMIT_EXCEEDED` (5) | `'time_limit_exceeded'` | — |
| `COMPILE_ERROR` (6) | `'compile_error'` | Uses `compile_output` when available |
| Runtime errors (7–12) | `'runtime_error'`, `'memory_limit_exceeded'`, or `'output_limit_exceeded'` | Heuristic detection via stderr/message/signal |
| `INTERNAL_ERROR` (13), `EXEC_FORMAT_ERROR` (14) | `'internal_error'` | — |
| Default | `'internal_error'` | Catch-all |

### Internal Helpers

- `normalizeText(text)` — lowercase normalisation
- `cleanRuntimeError(error)` — strips shell noise from stderr
- `detectMemoryLimitExceeded(test)` — checks stderr, message, exit code 137, SIGKILL
- `detectOutputLimitExceeded(test)` — checks stderr/message for "output limit"
- `getRuntimeErrorResult(test)` — dispatches to specific runtime error sub-types

## Dependencies

- [../../constants/judgeStatus.md](../../constants/judgeStatus.md) — `JUDGE0_STATUS`, `JUDGE0_STATUS_MESSAGES`

## Used By

- [../../services/execution/executionService.md](../../services/execution/executionService.md)
