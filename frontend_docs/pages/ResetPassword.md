# `frontend/src/pages/ResetPassword.jsx`

**Source:** `frontend/src/pages/ResetPassword.jsx`  
**Doc path:** `frontend_docs/pages/ResetPassword.md`

# File Purpose

Allows a user to set a new password using a token received via email.

# Responsibilities

- Extract the reset `token` from the URL parameters.
- Provide a form for a new password and password confirmation.
- Validate inputs using Zod (min 8 chars, passwords must match).
- Submit the new password to `POST /user/reset-password/:token`.
- Navigate the user back to the login page on success.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `ResetPassword` | default export | Page container |
| `resetPasswordSchema` | Zod object | Validates `password` and `confirmPassword` |

# Internal Logic

1. Retrieves `:token` using `useParams()`.
2. Evaluates form with `react-hook-form`.
3. Calls `axiosClient.post('/user/reset-password/${token}', { password })`.
4. Navigates to `/login` with a delay upon success.

# Dependencies

- `react-router`
- `react-hook-form`
- `zod`, `@hookform/resolvers/zod`
- `../utils/axiosClient`

# Used By

- [`App.jsx`](./App.md) - Renders at `/reset-password/:token`.
