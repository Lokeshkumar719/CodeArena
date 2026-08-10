# File Purpose

Named constants for Judge0 submission `status.id` values used when comparing execution results.

**Documented Source File:** `backend/src/constants/judgeStatus.js`

# Responsibilities

- Centralize status IDs for queue/processing/accepted/error states
- Map numeric status codes to human-readable error messages (`JUDGE0_STATUS_MESSAGES`)

# Main Functions / Components / Classes

| Export | Description |
|--------|-------------|
| `JUDGE0_STATUS` | Map of status names to numeric IDs (ACCEPTED: 3, COMPILE_ERROR: 6, TLE: 5, etc.) |
| `JUDGE0_STATUS_MESSAGES` | Map of status IDs to default user-facing status messages |

# Internal Logic

Static export module.

# Inputs and Outputs

Read-only constants imported by judge result utility helpers.

# Dependencies

None.

# Used By

- [../utils/judge/judgeUtils.md](../utils/judge/judgeUtils.md) — used by `getSubmissionResult` to convert raw Judge0 status responses to internal application states

# API Connections

Maps directly to standard Judge0 status identifiers.

# Database Connections

None.

# State/Context Dependencies

None.

# Related Files

- [judge0.md](./judge0.md)
- [../utils/judge/judgeUtils.md](../utils/judge/judgeUtils.md)

# Next Files To Read

1. [../utils/judge/judgeUtils.md](../utils/judge/judgeUtils.md)

# Common Risks / Notes

- Status IDs must correspond with the deployed Judge0 API specification.

# Last Reviewed: 2026-08-10
