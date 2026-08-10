# `frontend/src/pages/Login.jsx`

**Source:** `frontend/src/pages/Login.jsx`  
**Doc path:** `frontend_docs/pages/Login.md`

# File Purpose

Login page: email/password form with client validation, dispatches Redux login, handles unverified emails, and handles rate limiting.

# Responsibilities

- Validate form with Zod + `react-hook-form`.
- Dispatch `loginUser` with `{ emailId, password }`.
- Redirect to `/` when `isAuthenticated` becomes true.
- Display login errors, handle rate limiting, and prompt for email verification resend if necessary.
- Link to Signup, Forgot Password, and Resend Verification.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `Login` | default export component | Full page UI |
| `loginSchema` | Zod schema | `emailId` email, `password` min 1 char |

# Internal Logic

1. `useSelector` → `isAuthenticated`, `loading`, `error`.
2. `useForm` with `zodResolver(loginSchema)`.
3. `useRateLimit` handles 429 errors from the backend.
4. `useEffect`: if `isAuthenticated`, `navigate("/")`.
5. `onSubmit` → `dispatch(loginUser(data))`. If unwrap fails, checks for rate limits and sets `showResendVerification` if the email is unverified.
6. Local `showPassword` toggles password field type.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| User form submit | Redux `loginUser` thunk |
| `state.auth.isAuthenticated` | Client redirect to `/` |
| `state.auth.loading` | Disables submit, shows loading on button |
| `error` | Renders error alert or rate-limit message |

# Dependencies

| Package / file | Role |
|----------------|------|
| `react-hook-form`, `@hookform/resolvers/zod`, `zod` | Form validation |
| `react-redux` | Dispatch / select auth |
| `react-router` | `useNavigate`, `NavLink` |
| `../hooks/useRateLimit` | Rate limiting hook |
| `../authSlice` | `loginUser` |

# Used By

- [`App.md`](./App.md) — route `/login`

# API Connections

Via `loginUser`: `POST /user/login` ([`../state/authSlice.md`](../state/authSlice.md)).

# Database Connections

None.

# State/Context Dependencies

- `state.auth.isAuthenticated`, `loading`, `error`

# Related Files

- [`Signup.md`](./Signup.md)
- [`../state/authSlice.md`](../state/authSlice.md)
- [`../../docs/AUTH_FLOW.md`](../../docs/AUTH_FLOW.md)

# Next Files To Read

1. [`Signup.md`](./Signup.md)
2. [`../state/authSlice.md`](../state/authSlice.md)

# Common Risks / Notes

- Redux `error` is selected but never shown to the user (only field-level Zod errors).
- Shares UI pattern with Signup (CodeArena branding, DaisyUI card).

# Last Reviewed: 2026-05-18
