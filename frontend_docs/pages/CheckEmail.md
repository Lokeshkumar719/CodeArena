# `frontend/src/pages/CheckEmail.jsx`

**Source:** `frontend/src/pages/CheckEmail.jsx`  
**Doc path:** `frontend_docs/pages/CheckEmail.md`

# File Purpose

A simple static confirmation page shown to users immediately after they successfully register.

# Responsibilities

- Inform the user that a verification email has been sent.
- Provide a button to navigate back to the Login page.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `CheckEmail` | default export | Page container |

# Internal Logic

Stateless presentational component. No API calls or hooks are used other than `NavLink`.

# Dependencies

- `react-router` - `NavLink`

# Used By

- [`App.jsx`](./App.md) - Renders at `/check-email`.
- [`Signup.jsx`](./Signup.md) - Navigates here upon successful registration.
