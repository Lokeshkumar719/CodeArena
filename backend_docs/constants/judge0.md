# File Purpose

Shared constants for Judge0 integration: language ID map and polling configuration.

**Documented Source File:** `backend/src/constants/judge0.js`

# Responsibilities

- Map CodeArena language names to Judge0 CE numeric `language_id` values
- Define CPU/Wall time multipliers and polling retry settings

# Main Functions / Components / Classes

| Export | Value |
|--------|-------|
| `LANGUAGE_IDS` | `{ cpp: 54, java: 62, javascript: 63 }` |
| `MAX_POLLING_RETRIES` | `10` |
| `POLLING_INTERVAL` | `1000` (milliseconds) |
| `MAX_BATCH_SIZE` | `15` |
| `MAX_REFERENCE_VALIDATION_TESTCASES` | `10` |
| `CPU_TIME_MULTIPLIER` | `3` |
| `WALL_TIME_MULTIPLIER` | `5` |

# Internal Logic

Pure data module re-exported via `module.exports`.

# Inputs and Outputs

Consumable read-only constants.

# Dependencies

None.

# Used By

- [../services/execution/judge0Service.md](../services/execution/judge0Service.md) — `MAX_POLLING_RETRIES`, `POLLING_INTERVAL`
- [../utils/judge/judge0Utils.md](../utils/judge/judge0Utils.md) — `LANGUAGE_IDS`
- [../utils/judge/judgeUtils.md](../utils/judge/judgeUtils.md) — `CPU_TIME_MULTIPLIER`, `WALL_TIME_MULTIPLIER`

# API Connections

Values match the deployed Judge0 CE language list.

# Database Connections

None.

# State/Context Dependencies

None.

# Related Files

- [../services/execution/judge0Service.md](../services/execution/judge0Service.md)
- [../utils/judge/judge0Utils.md](../utils/judge/judge0Utils.md)
- [judgeStatus.md](./judgeStatus.md)

# Next Files To Read

1. [judgeStatus.md](./judgeStatus.md)
2. [../services/execution/judge0Service.md](../services/execution/judge0Service.md)

# Common Risks / Notes

- Language IDs must match Judge0 CE setup.

# Last Reviewed: 2026-08-10
