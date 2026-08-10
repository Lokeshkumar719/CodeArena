# `frontend/src/pages/Profile.jsx`

**Source:** `frontend/src/pages/Profile.jsx`  
**Doc path:** `frontend_docs/pages/Profile.md`

# File Purpose

Displays a user's public profile, including their avatar, institution, bio, and platform statistics (problems solved, etc.).

# Responsibilities

- Fetch profile data by `username`.
- Render the profile header (avatar, username, bio, institution, joined date).
- Display a grid of `StatCard` components.
- Provide an "Edit Profile" link if the authenticated user is viewing their own profile.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `Profile` | default export | Page container |
| `StatCard` | inner component | UI for individual statistics |

# Internal Logic

1. Retrieves `:username` via `useParams()`.
2. Inside `useEffect`, fetches profile using `GET /profile/:username`.
3. Compares the profile's `_id` against the currently authenticated user's `_id` from Redux state to conditionally render the "Edit Profile" button.
4. Renders the data. If the profile doesn't exist, handles the error gracefully.

# Dependencies

- `react-router` - `useParams`, `NavLink`
- `react-redux` - `useSelector` (to check `state.auth.user._id`)
- `../utils/axiosClient`

# Used By

- [`App.jsx`](./App.md) - Renders at `/profile/:username`.
