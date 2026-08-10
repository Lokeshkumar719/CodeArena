# File Purpose

Service layer for Judge0 CE batch submission and result polling. Abstracts RapidAPI HTTP calls behind `submitBatch` and `submitToken`.

**Documented Source File:** `backend/src/services/execution/judge0Service.js`

# Responsibilities

- POST a batch of submissions to Judge0
- Poll GET batch until all submissions have completed processing (`status.id > 2`)
- Enforce max retries and interval from constants
- Throw on timeout or HTTP errors

# Main Functions / Components / Classes

| Export | Description |
|--------|-------------|
| `submitBatch(submissions)` | POST `/submissions/batch` |
| `submitToken(resultTokens)` | GET `/submissions/batch` with tokens, poll until complete |

# Dependencies

- [../../config/judge0Client.md](../../config/judge0Client.md)
- [../../constants/judge0.md](../../constants/judge0.md)

# Used By

- [executionService.md](./executionService.md)
- [../problem/validateReferenceSolutions.md](../problem/validateReferenceSolutions.md)

# Related Files

- [../../config/judge0Client.md](../../config/judge0Client.md)
- [../../constants/judge0.md](../../constants/judge0.md)
- [../../constants/judgeStatus.md](../../constants/judgeStatus.md)

# Last Reviewed: 2026-08-10
