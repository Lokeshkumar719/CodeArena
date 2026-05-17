# `frontend/src/utils/axiosClient.js`

**Source:** `frontend/src/utils/axiosClient.js`  
**Doc path:** `frontend_docs/services/axiosClient.md`

# File Purpose

Shared Axios instance for all backend API calls from the browser, with JSON defaults and cookie-based credentials.

# Responsibilities

- Single `baseURL` for the Express API.
- Send cookies on cross-origin requests (`withCredentials: true`) for session/JWT cookies set by the backend.
- Default `Content-Type: application/json`.

# Main Functions / Components / Classes

| Export | Type | Description |
|--------|------|-------------|
| `axiosClient` (default) | Axios instance | Preconfigured `axios.create(...)` |

# Internal Logic

```javascript
axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});
```

No request/response interceptors in this file.

# Inputs and Outputs

| Caller provides | Returns |
|-----------------|---------|
| HTTP method, path, body (per call) | Axios response promise (`data`, `status`, etc.) |

# Dependencies

| Package | Role |
|---------|------|
| `axios` | HTTP client |

# Used By

- [`../state/authSlice.md`](../state/authSlice.md) — `/user/*`
- [`../pages/Homepage.md`](../pages/Homepage.md) — problem list, solved list
- [`../pages/ProblemPage.md`](../pages/ProblemPage.md) — problem detail, run, submit
- Admin components (`AdminPanel`, `AdminUpdate`, `AdminUpdateList`, `AdminDelete`, `AdminVideo`, `AdminUpload`)
- [`../components/SubmissionHistory.md`](../components/SubmissionHistory.md)

**Exception:** [`../components/AdminUpload.md`](../components/AdminUpload.md) uses plain `axios` for direct multipart upload to Cloudinary (not this client).

# API Connections

All paths are relative to `http://localhost:3000`. Backend route docs (when present): `../../backend_docs/routes/`.

| Area | Example paths used in frontend |
|------|--------------------------------|
| Auth | `POST /user/register`, `POST /user/login`, `GET /user/check`, `POST /user/logout` |
| Problems | `GET /problem/getAllProblems`, `GET /problem/problemById/:id`, `POST /problem/create`, etc. |
| Submissions | `POST /submission/run/:id`, `POST /submission/submit/:id` |
| Video | `GET /video/create/:problemId`, `POST /video/save` |

See also [`../../docs/API_FLOW.md`](../../docs/API_FLOW.md).

# Database Connections

None (HTTP only).

# State/Context Dependencies

None.

# Related Files

- [`../../docs/API_FLOW.md`](../../docs/API_FLOW.md)
- [`../../docs/AUTH_FLOW.md`](../../docs/AUTH_FLOW.md)
- Backend: `backend/src/index.js` (mount paths)

# Next Files To Read

1. [`../state/authSlice.md`](../state/authSlice.md)
2. [`../../docs/API_FLOW.md`](../../docs/API_FLOW.md)

# Common Risks / Notes

- **Hardcoded localhost** — production builds need env-based `baseURL` (not in repo).
- No centralized error handling; each caller handles errors locally.
- `withCredentials: true` requires backend CORS to allow credentials and matching cookie domain.

# Last Reviewed: 2026-05-18
