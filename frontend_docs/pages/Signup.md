# `frontend/src/pages/Signup.jsx`

**Source:** `frontend/src/pages/Signup.jsx`  
**Doc path:** `frontend_docs/pages/Signup.md`

# File Purpose

Registration page: collects first name, email, password; validates and registers via Redux; redirects when authenticated.

# Responsibilities

- Zod validation for signup fields.
- Dispatch `registerUser` with form data.
- Redirect to `/` on successful auth.
- NavLink to login.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `Signup` | default export component | Page UI |
| `signupSchema` | Zod object | `firstName` min 3, `emailId` email, `password` min 8 |

# Internal Logic

Same pattern as Login: `useForm` + `registerUser` on submit; `useEffect` navigates to `/` when `isAuthenticated`; password visibility toggle; does not read or display `state.auth.error`.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `{ firstName, emailId, password }` | `registerUser` thunk |
| Auth success | Navigate `/` |

# Dependencies

| Module | Role |
|--------|------|
| `react-hook-form`, `zod`, `@hookform/resolvers/zod` | Form |
| `react-redux` | `registerUser`, `isAuthenticated`, `loading` |
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
