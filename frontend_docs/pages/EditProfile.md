# `frontend/src/pages/EditProfile.jsx`

**Source:** `frontend/src/pages/EditProfile.jsx`  
**Doc path:** `frontend_docs/pages/EditProfile.md`

# File Purpose

Allows an authenticated user to update their profile information (username, bio, institution) and optionally change their avatar.

# Responsibilities

- Fetch the current user's profile (`GET /profile/me`).
- Populate a form with the current data.
- Handle image file selection for the avatar.
- Submit the updated profile data to `PUT /profile/edit`.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `EditProfile` | default export | Page container |

# Internal Logic

1. On mount, calls `axiosClient.get('/profile/me')` and populates local form state.
2. The form handles `username`, `bio`, and `institution` via standard inputs.
3. The avatar uses a file input (`onChange={handleFileChange}`).
4. Submitting the form wraps the data (including the image file if selected) into a `FormData` object.
5. `PUT /profile/edit` is called with the `FormData` object.
6. A toast notifies the user of success or error.

# Dependencies

- `../utils/axiosClient`
- `react-hot-toast`

# Used By

- [`App.jsx`](./App.md) - Renders at `/profile/edit` (Requires auth).
