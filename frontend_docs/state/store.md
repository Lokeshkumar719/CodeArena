# `frontend/src/store/store.js`

**Source:** `frontend/src/store/store.js`  
**Doc path:** `frontend_docs/state/store.md`

# File Purpose

Configures and exports the single Redux Toolkit store for the frontend.

# Responsibilities

- Register reducers (currently only `auth`).
- Export `store` for `Provider` in `main.jsx`.

# Main Functions / Components / Classes

| Export | Type | Description |
|--------|------|-------------|
| `store` | Redux store | `configureStore({ reducer: { auth: authReducer } })` |

# Internal Logic

`configureStore` merges `authReducer` (default export from `authSlice.js`) under the `auth` key, so selectors use `state.auth`.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `authSlice` default reducer | Configured store with `getState`, `dispatch`, `subscribe` |

# Dependencies

| Module | Role |
|--------|------|
| `@reduxjs/toolkit` | `configureStore` |
| `../authSlice` | `auth` slice reducer |

# Used By

- [`../pages/main.md`](../pages/main.md) — `Provider store={store}`

# API Connections

None.

# Database Connections

None.

# State/Context Dependencies

- Defines global Redux state shape: `{ auth: { user, isAuthenticated, loading, error } }` — see [`authSlice.md`](./authSlice.md).

# Related Files

- [`authSlice.md`](./authSlice.md)
- [`../pages/main.md`](../pages/main.md)

# Next Files To Read

1. [`authSlice.md`](./authSlice.md)
2. [`../services/axiosClient.md`](../services/axiosClient.md)

# Common Risks / Notes

- Only one slice today; new global domains (e.g. problems cache) require adding reducers here.
- No RTK Query or middleware configured.

# Last Reviewed: 2026-05-18
