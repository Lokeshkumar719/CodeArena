# File Purpose

Utility to safely decode Base64 encoded strings to UTF-8.

**Documented Source File:** `backend/src/utils/judge/decodeBase64.js`

# Responsibilities

- Decode Base64 strings returned by the Judge0 API.
- Gracefully handle decoding failures by returning the original value and logging the error.
- Return `null` if the input is falsy.

# Main Functions / Components / Classes

| Export | Description |
|--------|-------------|
| `decodeBase64(value)` | Takes a Base64 string and returns the UTF-8 decoded string, or original value on error. |

# Dependencies

Node.js built-in `Buffer`.

# Used By

- [../../services/execution/judge0Service.md](../../services/execution/judge0Service.md) - for decoding Judge0 polling responses (`stdout`, `stderr`, `compile_output`, `message`, `stdin`, `expected_output`).

# Last Reviewed: 2026-08-10
