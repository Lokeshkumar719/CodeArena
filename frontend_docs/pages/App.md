# `frontend/src/App.jsx`

**Source:** `frontend/src/App.jsx`  
**Doc path:** `frontend_docs/pages/App.md`

# File Purpose

Root application component responsible for routing, global layout layout wrapper, route change progress bars (NProgress), and triggering initial authentication state verification.

# Responsibilities

- Initialize `checkAuth()` thunk on mount.
- Show `LoadingScreen` globally while `loading` is true.
- Define client-side routes via `react-router` `<Routes>`.
- Render `NProgress` loading bar on route changes.
- Implement route protection (Private vs Public routes).

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `App` | default export component | Router container |

# Internal Logic

1. `useEffect` dispatches `checkAuth()`.
2. `useEffect` listens to location changes to start/done `nprogress` bar.
3. Renders a `min-h-screen` flex column wrapper.
4. If `loading` is true, halts routing and shows `LoadingScreen`.

## Routes (Protected vs Public)

**Public Routes:**
- `/` → `LandingPage` (if not authenticated) OR `Homepage` (if authenticated)
- `/login` → `Login`
- `/signup` → `Signup`
- `/check-email` → `CheckEmail`
- `/verify-email/:token` → `VerifyEmail`
- `/resend-verification` → `ResendVerification`
- `/forgot-password` → `ForgotPassword`
- `/reset-password/:token` → `ResetPassword`
- `/profile/:username` → `Profile`

**Protected Routes (Require Authentication):**
- `/change-password` → `ChangePassword`
- `/profile/edit` → `EditProfile`
- `/problem/:slug` → `ProblemPage`

**Admin Routes (Protected):**
- `/admin` → `Admin`
- `/admin/create` → `CreateProblem`
- `/admin/update-list` → `UpdateProblemList`
- `/admin/update/:id` → `UpdateProblem`
- `/admin/delete` → `DeleteProblem`
- `/admin/video` → `ManageVideoSolutions`
- `/admin/upload/:problemId` → `UploadVideoSolution`

# Dependencies

- `react-router`
- `react-redux`
- `nprogress`
- All page components.
p`, `Homepage`, `ProblemPage`, `Admin` |
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
