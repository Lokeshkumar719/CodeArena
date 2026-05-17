# File Purpose

Shared constants for Judge0 integration: language ID map and polling configuration used by [../services/judge0Service.md](../services/judge0Service.md) and [../utils/problemUtility.md](../utils/problemUtility.md).

# Responsibilities

- Map CodeArena language names to Judge0 CE numeric `language_id` values
- Define polling retry count and delay between polls

# Main Functions / Components / Classes

| Export | Value |
|--------|-------|
| `LANGUAGE_IDS` | `{ cpp: 54, java: 62, javascript: 63 }` |
| `MAX_POLLING_RETRIES` | `10` |
| `POLLING_INTERVAL` | `1000` (milliseconds) |

# Internal Logic

Pure data module — no functions. Re-exported via `module.exports` object.

# Inputs and Outputs

Consumed as `require('../constants/judge0')` — read-only constants.

# Dependencies

None.

# Used By

- [../services/judge0Service.md](../services/judge0Service.md) — `MAX_POLLING_RETRIES`, `POLLING_INTERVAL`
- [../utils/problemUtility.md](../utils/problemUtility.md) — `LANGUAGE_IDS`

# API Connections

Values must stay aligned with [Judge0 CE language list](https://ce.judge0.com/languages) for the RapidAPI deployment in use.

# Database Connections

None.

# State/Context Dependencies

None.

# Related Files

- [../services/judge0Service.md](../services/judge0Service.md)
- [../utils/problemUtility.md](../utils/problemUtility.md)
- [judgeStatus.md](./judgeStatus.md)

# Next Files To Read

1. [judgeStatus.md](./judgeStatus.md)
2. [../services/judge0Service.md](../services/judge0Service.md)

# Common Risks / Notes

- Only three languages configured; must match `submission` schema enum and frontend Monaco language picker.
- Changing `POLLING_INTERVAL` without adjusting `MAX_POLLING_RETRIES` changes total max wait (~10s today).
- Language IDs are Judge0-version-specific; verify after API upgrades.

# Last Reviewed: 2026-05-18
