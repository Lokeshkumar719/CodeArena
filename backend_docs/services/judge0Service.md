# File Purpose

Service layer for Judge0 CE batch submission and result polling. Abstracts RapidAPI HTTP calls behind `submitBatch` and `submitToken`.

# Responsibilities

- POST a batch of submissions to Judge0
- Poll GET batch until all submissions have `status.id > 2` (finished processing)
- Enforce max retries and interval from constants
- Throw on timeout or HTTP errors

# Main Functions / Components / Classes

| Export | Description |
|--------|-------------|
| `submitBatch(submissions)` | POST `/submissions/batch`, returns `response.data` (array of `{ token }`) |
| `submitToken(resultTokens)` | GET `/submissions/batch` with tokens, poll until complete |
| `waiting(timer)` | Private `setTimeout` promise helper |

# Internal Logic

### submitBatch

```text
POST /submissions/batch
  params: base64_encoded=false
  body: { submissions: [...] }
→ response.data (caller expects array of token objects)
```

### submitToken

Loop `retry` from `0` to `MAX_POLLING_RETRIES - 1`:

1. GET `/submissions/batch` with `tokens` comma-joined, `fields: *`
2. Read `results.submissions`
3. `isResultObtained = every(result => result.status.id > 2)`
4. If true, return `submissions` array
5. Else `await waiting(POLLING_INTERVAL)` (1000 ms default)
6. After loop: `throw new Error("Judge0 polling timeout exceeded")`

Status ids `1` (in queue) and `2` (processing) continue polling.

# Inputs and Outputs

### submitBatch input shape (per item)

| Field | Description |
|-------|-------------|
| `source_code` | User or reference code |
| `language_id` | Judge0 numeric id |
| `stdin` | Test input |
| `expected_output` | Expected stdout |

### submitToken output

Array of submission result objects (Judge0 shape with `status`, `time`, `memory`, `stderr`, etc.).

# Dependencies

**Internal:** [../config/judge0Client.md](../config/judge0Client.md), [../constants/judge0.md](../constants/judge0.md)

# Used By

- [../controllers/problemsControllers.md](../controllers/problemsControllers.md)
- [../controllers/userSubmission.md](../controllers/userSubmission.md)

# API Connections

| Method | Path | Client |
|--------|------|--------|
| POST | `/submissions/batch` | judge0Client |
| GET | `/submissions/batch` | judge0Client |

Host: `https://judge0-ce.p.rapidapi.com` (via [../config/judge0Client.md](../config/judge0Client.md)).

# Database Connections

None.

# State/Context Dependencies

- `MAX_POLLING_RETRIES` (10) × `POLLING_INTERVAL` (1000 ms) ≈ max ~10 s wait (plus request time)
- Assumes `response.data.submissions` exists on GET (Judge0 batch response shape)

# Related Files

- [../config/judge0Client.md](../config/judge0Client.md)
- [../constants/judge0.md](../constants/judge0.md)
- [../constants/judgeStatus.md](../constants/judgeStatus.md)
- [../utils/problemUtility.md](../utils/problemUtility.md)

# Next Files To Read

1. [../constants/judge0.md](../constants/judge0.md)
2. [../constants/judgeStatus.md](../constants/judgeStatus.md)

# Common Risks / Notes

- Throws generic timeout error after retries — caller should handle 500.
- `console.error` on failure then rethrow.
- No backoff/jitter; fixed 1s interval.
- Batch size limited by Judge0/RapidAPI plan, not checked here.
- `submitBatch` return type assumed array; if API wraps differently, callers break.

# Last Reviewed: 2026-05-18
