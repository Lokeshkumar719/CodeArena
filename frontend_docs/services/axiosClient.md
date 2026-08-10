# `frontend/src/utils/axiosClient.js`

**Source:** `frontend/src/utils/axiosClient.js`  
**Doc path:** `frontend_docs/services/axiosClient.md`

# File Purpose

Shared Axios instance for all backend API calls from the browser, handling global configuration, silent token refresh, and rate-limit extraction.

# Responsibilities

- Provide a single `baseURL` using `import.meta.env.VITE_API_URL`.
- Send cookies automatically (`withCredentials: true`) to manage HTTP-only JWTs.
- Intercept 401 (Unauthorized) errors and attempt a silent token refresh via `POST /user/refresh-token`, unless the original request was an authentication route.
- Intercept 429 (Too Many Requests) errors and parse the `retryAfterSeconds` into `error.rateLimitedFor` for use by `useRateLimit`.

# Main Functions / Components / Classes

| Export | Type | Description |
|--------|------|-------------|
| `axiosClient` (default) | Axios instance | Preconfigured instance with interceptors |

# Internal Logic

1. **Configuration:**
   - `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'`
   - `withCredentials: true`

2. **Response Interceptor:**
   - **On Success:** Returns the response directly.
   - **On 429 Error:** Maps `error.response.data.retryAfterSeconds` to `error.rateLimitedFor`, then rejects.
   - **On 401 Error:**
     - Checks if the URL matches an `authRoutes` exclusion list (e.g., `/user/login`, `/user/refresh-token`).
     - If excluded, immediately rejects.
     - If not excluded, it queues a `POST /user/refresh-token` call.
     - If the refresh succeeds, it modifies the original request config and retries it via `axiosClient(originalRequest)`.
     - If the refresh fails, it redirects the browser to `/login`.

# Dependencies

- `axios`

# Used By

- [`../state/authSlice.md`](../state/authSlice.md) — `/user/*`
- [`../pages/Homepage.md`](../pages/Homepage.md) — problem list, solved list
- [`../pages/ProblemPage.md`](../pages/ProblemPage.md) — problem detail, run, submit
- Admin components (`AdminPanel`, `AdminUpdate`, `AdminUpdateList`, `AdminDelete`, `AdminVideo`, `AdminUpload`)
- [`../components/SubmissionHistory.md`](../components/SubmissionHistory.md)


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
