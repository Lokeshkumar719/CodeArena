# `frontend/src/pages/ResendVerification.jsx`

**Source:** `frontend/src/pages/ResendVerification.jsx`  
**Doc path:** `frontend_docs/pages/ResendVerification.md`

# File Purpose

Allows a user to request a new email verification link if they didn't receive the original one or if it expired.

# Responsibilities

- Present an email input form, optionally pre-filled from URL search parameters.
- Submit the request to `POST /user/resend-verification`.
- Display a success message or error (such as "Email already verified").

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `ResendVerification` | default export | Page container |

# Internal Logic

1. Retrieves the `email` search parameter using `useSearchParams()`.
2. Pre-fills the `react-hook-form` default value.
3. On submit, calls `axiosClient.post('/user/resend-verification', { emailId })`.
4. Navigates to `/check-email` upon success.

# Dependencies

- `react-router` - `useSearchParams`, `useNavigate`
- `react-hook-form`
- `../utils/axiosClient`

# Used By

- [`App.jsx`](./App.md) - Renders at `/resend-verification`.
- [`Login.jsx`](./Login.md) - Links here if a user tries to log in with an unverified email.
