# File Purpose

Named constants for Judge0 submission `status.id` values used when comparing execution results in controllers.

# Responsibilities

- Centralize magic numbers for queue/processing/accepted/compile-error states
- Avoid scattering numeric literals in problem and submission controllers

# Main Functions / Components / Classes

| Export | Contents |
|--------|----------|
| `JUDGE0_STATUS` | Object with keys below |

| Key | Value | Judge0 meaning (typical) |
|-----|-------|--------------------------|
| `IN_QUEUE` | 1 | In queue |
| `PROCESSING` | 2 | Processing |
| `ACCEPTED` | 3 | Accepted |
| `COMPILE_ERROR` | 4 | Compilation error |

# Internal Logic

Static export only. [../services/judge0Service.md](../services/judge0Service.md) uses raw `status.id > 2` instead of these names for completion detection.

# Inputs and Outputs

Read-only import in controllers.

# Dependencies

None.

# Used By

- [../controllers/problemsControllers.md](../controllers/problemsControllers.md) — compares `test.status_id` to `ACCEPTED`
- [../controllers/userSubmission.md](../controllers/userSubmission.md) — compares `test.status.id` to `ACCEPTED` and `COMPILE_ERROR`

# API Connections

Maps to Judge0 CE status identifiers returned in submission poll responses.

# Database Connections

None.

# State/Context Dependencies

None.

# Related Files

- [../constants/judge0.md](./judge0.md)
- [../services/judge0Service.md](../services/judge0Service.md)
- [../controllers/userSubmission.md](../controllers/userSubmission.md)

# Next Files To Read

1. [../controllers/userSubmission.md](../controllers/userSubmission.md)

# Common Risks / Notes

- Incomplete enum — runtime errors, TLE, WA, etc. are not named; controllers treat non-ACCEPTED as wrong/error.
- **Inconsistency:** `problemsControllers` uses `status_id`; `userSubmission` uses `status.id` — confirm against live Judge0 GET batch payload.
- `IN_QUEUE` / `PROCESSING` unused in controllers (handled in service poll loop).

# Last Reviewed: 2026-05-18
