# File Purpose

Preconfigured Axios HTTP client for the Judge0 CE API hosted on RapidAPI. Centralizes base URL, authentication headers, JSON content type, and request timeout for all Judge0 calls.

# Responsibilities

- Load RapidAPI credentials from environment
- Expose a shared `axios` instance with Judge0 RapidAPI host headers
- Enforce a 10-second per-request timeout

# Main Functions / Components / Classes

| Export | Type | Description |
|--------|------|-------------|
| `judge0Client` | `axios.AxiosInstance` | `axios.create({ baseURL, headers, timeout: 10000 })` |

# Internal Logic

```text
baseURL: https://judge0-ce.p.rapidapi.com
headers:
  x-rapidapi-key: process.env.RAPID_API_KEY
  x-rapidapi-host: judge0-ce.p.rapidapi.com
  Content-Type: application/json
timeout: 10000 ms
```

No interceptors or retry logic are defined in this file.

# Inputs and Outputs

| Input | Description |
|-------|-------------|
| `process.env.RAPID_API_KEY` | RapidAPI key for Judge0 CE |

| Output | Description |
|--------|-------------|
| Axios instance | Used by `judge0Service` for `/submissions/batch` POST and GET |

# Dependencies

**npm:** `dotenv`, `axios`

# Used By

- [../services/judge0Service.md](../services/judge0Service.md) — sole consumer via `judge0Client.request(options)`

# API Connections

| External API | Base URL |
|--------------|----------|
| Judge0 CE (RapidAPI) | `https://judge0-ce.p.rapidapi.com` |

Endpoints used indirectly through [../services/judge0Service.md](../services/judge0Service.md):

- `POST /submissions/batch`
- `GET /submissions/batch` (poll by tokens)

# Database Connections

None.

# State/Context Dependencies

- `RAPID_API_KEY` must be valid for RapidAPI Judge0 subscription
- 10s timeout may be insufficient for large batches or slow Judge0 queue

# Related Files

- [../services/judge0Service.md](../services/judge0Service.md)
- [../constants/judge0.md](../constants/judge0.md)
- [../constants/judgeStatus.md](../constants/judgeStatus.md)
- [../controllers/userSubmission.md](../controllers/userSubmission.md)
- [../controllers/problemsControllers.md](../controllers/problemsControllers.md)
- [../docs/BACKEND_FLOW.md](../docs/BACKEND_FLOW.md)

# Next Files To Read

1. [../services/judge0Service.md](../services/judge0Service.md) — batch submit and polling
2. [../constants/judge0.md](../constants/judge0.md) — polling tuning

# Common Risks / Notes

- Hardcoded RapidAPI host; not swappable without code change.
- No request logging or rate-limit handling.
- API key exposure risk if env leaks; never commit `.env`.
- Judge0 CE queue limits and RapidAPI quotas apply outside this file.

# Last Reviewed: 2026-05-18
