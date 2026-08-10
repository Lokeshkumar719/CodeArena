# `frontend/src/pages/ChangePassword.jsx`

**Source:** `frontend/src/pages/ChangePassword.jsx`  
**Doc path:** `frontend_docs/pages/ChangePassword.md`

# File Purpose

Allows an authenticated user to change their password by providing their current password.

# Responsibilities

- Present a form for current password, new password, and confirm new password.
- Validate inputs using Zod.
- Submit to `POST /user/change-password`.
- Handle rate-limiting (via `useRateLimit`) for repeated attempts.
- On success, dispatch `resetAuthState()` to log the user out on the client, forcing them to log in with the new password.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `ChangePassword` | default export | Page container |
| `changePasswordSchema` | Zod object | Form validation |

# Internal Logic

1. Retrieves form data via `react-hook-form`.
2. Calls `axiosClient.post('/user/change-password', data)`.
3. If successful, dispatches Redux action `resetAuthState()` (which clears `user` and `isAuthenticated`), showing a toast message and navigating to `/login`.
4. If rate-limited, sets cooldown using `startCooldown(error.rateLimitedFor)`.

# Dependencies

- `react-redux` - `useDispatch`
- `../authSlice` - `resetAuthState`
- `../hooks/useRateLimit.jsx`
- `../utils/axiosClient`

# Used By

- [`App.jsx`](./App.md) - Renders at `/change-password` (Requires auth).
