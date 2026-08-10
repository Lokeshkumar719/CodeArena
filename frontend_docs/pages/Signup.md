# `frontend/src/pages/Signup.jsx`

**Source:** `frontend/src/pages/Signup.jsx`  
**Doc path:** `frontend_docs/pages/Signup.md`

# File Purpose

Registration page: collects username, email, password; validates and registers via Redux; redirects to email verification check.

# Responsibilities

- Zod validation for signup fields.
- Dispatch `registerUser` with form data.
- Redirect to `/check-email` on successful registration.
- Handle rate-limiting via `useRateLimit`.
- NavLink to login.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `Signup` | default export component | Page UI |
| `signupSchema` | Zod object | `username` min 3, `emailId` email, `password` min 8 |

# Internal Logic

1. `useForm` + `zodResolver`.
2. `onSubmit` → `dispatch(registerUser(data))`.
3. If successful, `navigate('/check-email')` (Registration does NOT authenticate the user).
4. If rate-limited, triggers `startCooldown`.
5. Password visibility toggle.
6. Reads and displays `state.auth.error`.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `{ username, emailId, password }` | `registerUser` thunk |
| Auth success | Navigate `/check-email` |

# Dependencies

- `react-hook-form`, `zod`, `@hookform/resolvers/zod`
- `react-redux`
- `../hooks/useRateLimit`
- `react-router` (`NavLink`, `useNavigate`)

| `react-router` | Navigation / links |
| `../authSlice` | `registerUser` |

# Used By

- [`App.md`](./App.md) — `/signup`; default redirect for guests on `/`

# API Connections

`POST /user/register` via [`../state/authSlice.md`](../state/authSlice.md).

# Database Connections

None (frontend).

# State/Context Dependencies

- `state.auth.isAuthenticated`, `loading`

# Related Files

- [`Login.md`](./Login.md)
- [`../state/authSlice.md`](../state/authSlice.md)

# Next Files To Read

1. [`Homepage.md`](./Homepage.md)
2. [`../../docs/AUTH_FLOW.md`](../../docs/AUTH_FLOW.md)

# Common Risks / Notes

- App sends unauthenticated users to signup, not login — this page is the primary entry for new sessions.

# Last Reviewed: 2026-05-18
