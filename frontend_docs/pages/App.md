# `frontend/src/App.jsx`

**Source:** `frontend/src/App.jsx`  
**Doc path:** `frontend_docs/pages/App.md`

# File Purpose

Root routed application shell: runs initial auth check, shows loading gate, and defines all React Router routes with auth/admin guards.

# Responsibilities

- Dispatch `checkAuth()` on mount.
- Block UI with spinner while `state.auth.loading` is true.
- Render `Routes` / `Route` with conditional `Navigate` redirects.
- Enforce authenticated access to `/` and admin-only paths.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `App` | function component | Default export; route table |
| `isAdmin` | derived boolean | `user?.role?.toLowerCase() === "admin"` |

# Internal Logic

1. `useEffect` → `dispatch(checkAuth())` once (deps: `[dispatch]`).
2. If `loading`, return centered DaisyUI `loading-spinner`.
3. Compute `isAdmin` from Redux `user.role` (case-insensitive).
4. Routes:
   - `/` → `Homepage` if authenticated, else `Navigate` to `/signup`
   - `/login`, `/signup` → auth forms if guest, else `Navigate` to `/`
   - `/admin/*` → admin components if authenticated **and** admin, else `Navigate` to `/`
   - `/problem/:problemId` → `ProblemPage` (**no auth guard** in this file)

# Inputs and Outputs

| Input (Redux / router) | UI output |
|------------------------|-----------|
| `loading`, `isAuthenticated`, `user` | Spinner or route-matched page |
| URL path | Matched component or redirect |

# Dependencies

| Import | Role |
|--------|------|
| `react-router` | `Routes`, `Route`, `Navigate` |
| `react-redux` | `useDispatch`, `useSelector` |
| `react` | `useEffect` |
| `./authSlice` | `checkAuth` |
| Pages: `Login`, `Signup`, `Homepage`, `ProblemPage`, `Admin` |
| Components: `AdminPanel`, `AdminUpdate`, `AdminUpdateList`, `AdminDelete`, `AdminVideo`, `AdminUpload` |

# Used By

- [`main.md`](./main.md) — renders `<App />` inside router.

# API Connections

Indirect via `checkAuth` → `GET /user/check` ([`../state/authSlice.md`](../state/authSlice.md)).

# Database Connections

None.

# State/Context Dependencies

| Field | Usage |
|-------|--------|
| `state.auth.loading` | Full-screen gate |
| `state.auth.isAuthenticated` | Route guards |
| `state.auth.user` | Admin role check |

# Related Files

- All routed page/component docs under `frontend_docs/pages/` and `frontend_docs/components/`
- [`../../docs/FRONTEND_FLOW.md`](../../docs/FRONTEND_FLOW.md)

# Next Files To Read

1. [`../state/authSlice.md`](../state/authSlice.md)
2. [`Homepage.md`](./Homepage.md)
3. [`ProblemPage.md`](./ProblemPage.md)

# Common Risks / Notes

- Unauthenticated users hitting `/` go to **`/signup`**, not `/login`.
- `ProblemPage` is public at router level; API may still require cookies for submit.
- Admin check is case-insensitive here but [`Homepage.md`](./Homepage.md) uses `user?.role === "admin"` (strict) for nav link — inconsistent if role casing differs.

# Last Reviewed: 2026-05-18
