# `frontend/src/authSlice.js`

**Source:** `frontend/src/authSlice.js`  
**Doc path:** `frontend_docs/state/authSlice.md`

# File Purpose

Redux Toolkit slice and async thunks for user registration, login, session validation, and logout.

# Responsibilities

- Define four `createAsyncThunk` actions that call user auth REST endpoints.
- Maintain `auth` state: `user`, `isAuthenticated`, `loading`, `error`.
- Handle pending/fulfilled/rejected transitions for each thunk.
- Provide sync reducers to clear errors and reset auth state.

# Main Functions / Components / Classes

| Export | Type | Description |
|--------|------|-------------|
| `registerUser` | async thunk | `POST /user/register` → returns `response.data` |
| `loginUser` | async thunk | `POST /user/login` → returns `response.data.data` (the user object) |
| `checkAuth` | async thunk | `GET /user/check` → returns `response.data.data` (the user object) |
| `logoutUser` | async thunk | `POST /user/logout` → clears session |
| `clearError` | sync action | Clears the current `error` string |
| `resetAuthState` | sync action | Resets `user` and `isAuthenticated` (used after password change) |
| default | reducer | `authSlice.reducer` registered as `state.auth` |

**Slice name:** `auth`  
**Initial state:** `{ user: null, isAuthenticated: false, loading: false, error: null }`  

# Internal Logic

- Each thunk uses `axiosClient` and `rejectWithValue(error)` on failure (extracting rate-limit data or error message).
- **registerUser fulfilled:** Registration does NOT log the user in. It sets `isAuthenticated: false` and `user: null`, and navigates them to email verification.
- **loginUser / checkAuth fulfilled:** Sets `loading: false`, `isAuthenticated: true`, `user: action.payload`.
- **Rejected:** Sets `loading: false`, `error` from the payload, and clears the user (unless it's just a logout).
- **logout fulfilled:** `user: null`, `isAuthenticated: false`, `error: null`.

# Inputs and Outputs

| Thunk | Argument | Success payload |
|-------|----------|-----------------|
| `registerUser` | `{ username, emailId, password }` | Full API response |
| `loginUser` | `{ emailId, password }` | User object |
| `checkAuth` | none | User object |
| `logoutUser` | none | `null` |


# Dependencies

| Module | Role |
|--------|------|
| `@reduxjs/toolkit` | `createSlice`, `createAsyncThunk` |
| `../utils/axiosClient` | HTTP |

# Used By

| Consumer | Thunks / state |
|----------|----------------|
| [`../pages/App.md`](../pages/App.md) | `checkAuth`; reads `isAuthenticated`, `user`, `loading` |
| [`../pages/Login.md`](../pages/Login.md) | `loginUser` |
| [`../pages/Signup.md`](../pages/Signup.md) | `registerUser` |
| [`../pages/Homepage.md`](../pages/Homepage.md) | `logoutUser`; reads `user` |
| [`store.md`](./store.md) | Imports default reducer |

# API Connections

| Thunk | Method | Path |
|-------|--------|------|
| `registerUser` | POST | `/user/register` |
| `loginUser` | POST | `/user/login` |
| `checkAuth` | GET | `/user/check` |
| `logoutUser` | POST | `/user/logout` |

Backend: `../../backend_docs/` (e.g. `userAuth` routes) when documented. See [`../../docs/AUTH_FLOW.md`](../../docs/AUTH_FLOW.md).

# Database Connections

None in frontend; backend persists users via Mongoose (see backend user model docs).

# State/Context Dependencies

- Redux only; no React Context.
- `loading` starts `true` until first `checkAuth` completes (drives app-wide spinner in `App`).

# Related Files

- [`../services/axiosClient.md`](../services/axiosClient.md)
- [`store.md`](./store.md)
- [`../pages/Login.md`](../pages/Login.md), [`../pages/Signup.md`](../pages/Signup.md)

# Next Files To Read

1. [`../pages/App.md`](../pages/App.md)
2. [`../../docs/AUTH_FLOW.md`](../../docs/AUTH_FLOW.md)
3. Backend `userAuthenticate` controller (when `backend_docs` exists)

# Common Risks / Notes

- Rejected errors use `action.payload?.message`; Axios errors often need `error.response?.data?.message` — slice may show generic message.
- `checkAuth` 401 uses `rejectWithValue(null)` but rejected handler still sets `error` to `'Something went wrong'` (not distinguished from real errors).
- Thunks are named exports; App imports `{ checkAuth }` — must not import only default reducer elsewhere for dispatch.

# Last Reviewed: 2026-05-18
