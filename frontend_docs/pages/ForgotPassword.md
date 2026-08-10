# `frontend/src/pages/ForgotPassword.jsx`

**Source:** `frontend/src/pages/ForgotPassword.jsx`  
**Doc path:** `frontend_docs/pages/ForgotPassword.md`

# File Purpose

Provides the UI and logic for users to request a password reset email.

# Responsibilities

- Present a form asking for the user's registered email address.
- Validate the input using Zod and `react-hook-form`.
- Submit the request to `POST /user/forgot-password`.
- Handle rate-limiting errors by starting a cooldown timer using `useRateLimit`.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `ForgotPassword` | default export | Page container |
| `forgotPasswordSchema` | Zod object | Validates `emailId` |

# Internal Logic

1. Collects `emailId` from the form.
2. Calls `axiosClient.post('/user/forgot-password')`.
3. Displays a success toast upon completion.
4. Catch block checks for `error.rateLimitedFor` and triggers `startCooldown`.

# Dependencies

- `react-hook-form`
- `zod`, `@hookform/resolvers/zod`
- `../utils/axiosClient`
- `../hooks/useRateLimit.jsx`
- `react-hot-toast`

# Used By

- [`App.jsx`](./App.md) - Renders at `/forgot-password`.
