# `frontend/src/pages/Login.jsx`

**Source:** `frontend/src/pages/Login.jsx`  
**Doc path:** `frontend_docs/pages/Login.md`

# File Purpose

Login page: email/password form with client validation, dispatches Redux login, redirects when authenticated.

# Responsibilities

- Validate form with Zod + `react-hook-form`.
- Dispatch `loginUser` with `{ emailId, password }`.
- Redirect to `/` when `isAuthenticated` becomes true.
- Link to signup via `NavLink`.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `Login` | default export component | Full page UI |
| `loginSchema` | Zod schema | `emailId` email, `password` min 8 chars |

# Internal Logic

1. `useSelector` → `isAuthenticated`, `loading`, `error` ( **`error` is not rendered in JSX** ).
2. `useForm` with `zodResolver(loginSchema)`.
3. `useEffect`: if `isAuthenticated`, `navigate("/")`.
4. `onSubmit` → `dispatch(loginUser(data))`.
5. Local `showPassword` toggles password field type and eye icon button.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| User form submit | Redux `loginUser` thunk |
| `state.auth.isAuthenticated` | Client redirect to `/` |
| `state.auth.loading` | Disables submit, shows loading on button |

# Dependencies

| Package / file | Role |
|----------------|------|
| `react-hook-form`, `@hookform/resolvers/zod`, `zod` | Form validation |
| `react-redux` | Dispatch / select auth |
| `react-router` | `useNavigate`, `NavLink` |
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
