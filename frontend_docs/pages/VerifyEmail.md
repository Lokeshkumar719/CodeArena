# `frontend/src/pages/VerifyEmail.jsx`

**Source:** `frontend/src/pages/VerifyEmail.jsx`  
**Doc path:** `frontend_docs/pages/VerifyEmail.md`

# File Purpose

The landing page for the email verification link sent to a user's inbox. Automatically attempts to verify the token upon mount.

# Responsibilities

- Extract the `:token` from the URL.
- Make an API call to verify the token.
- Display a loading state, followed by a success or error message.
- Provide a link to proceed to login.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `VerifyEmail` | default export | Page container |

# Internal Logic

1. Retrieves `:token` via `useParams()`.
2. Inside a `useEffect`, calls `GET /user/verify-email/:token`.
3. If successful, sets `success` to true and displays the server's success message.
4. If failed, sets `success` to false and displays the error message.

# Dependencies

- `react-router` - `useParams`, `NavLink`
- `../utils/axiosClient`

# Used By

- [`App.jsx`](./App.md) - Renders at `/verify-email/:token`.
