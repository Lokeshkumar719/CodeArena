# File Purpose

Utility to calculate Judge0 execution limits (CPU time, Wall time, Memory) for a specific problem.

**Documented Source File:** `backend/src/utils/judge/getExecutionLimits.js`

# Responsibilities

- Apply global execution multipliers to a problem's base time limits.
- Return a standardized object containing the limits formatted for the Judge0 API payload.

# Main Functions / Components / Classes

| Export | Description |
|--------|-------------|
| `getExecutionLimits(problem)` | Takes a `Problem` document and returns `{ cpu_time_limit, wall_time_limit, memory_limit }`. |

# Internal Logic

Multiplies `problem.timeLimit` by `CPU_TIME_MULTIPLIER` and `WALL_TIME_MULTIPLIER` from constants, and passes `problem.memoryLimit` through directly.

# Dependencies

- [../../constants/judge0.md](../../constants/judge0.md) - `CPU_TIME_MULTIPLIER`, `WALL_TIME_MULTIPLIER`

# Used By

- [../../controllers/submission/submissionController.md](../../controllers/submission/submissionController.md) - to inject limits when executing runs and submits.
- [../../services/problem/validateReferenceSolutions.md](../../services/problem/validateReferenceSolutions.md) - to inject limits during reference solution validation.

# Last Reviewed: 2026-08-10
