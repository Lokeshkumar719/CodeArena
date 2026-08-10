# File Purpose

Utility to safely encode UTF-8 strings to Base64 format.

**Documented Source File:** `backend/src/utils/judge/encodeBase64.js`

# Responsibilities

- Encode standard strings into Base64 for safe transit to the Judge0 API.
- Return an empty string `''` if input is `null` or `undefined`.
- Cast inputs to String before encoding to prevent errors with numerical inputs.
- Gracefully handle encoding failures by returning the original value and logging the error.

# Main Functions / Components / Classes

| Export | Description |
|--------|-------------|
| `encodeBase64(value)` | Returns Base64 encoded string of the input. |

# Dependencies

Node.js built-in `Buffer`.

# Used By

- [../../services/execution/judge0Service.md](../../services/execution/judge0Service.md) - for encoding `source_code`, `stdin`, and `expected_output` before sending batch submissions.

# Last Reviewed: 2026-08-10
