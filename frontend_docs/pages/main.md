# `frontend/src/main.jsx`

**Source:** `frontend/src/main.jsx`  
**Doc path:** `frontend_docs/pages/main.md`

# File Purpose

Application entry point: mounts the React root, wraps the tree with Redux, routing, global toast notifications, and global styles.

# Responsibilities

- Call `createRoot` on `#root` from `index.html`.
- Provide `Provider` with the Redux store.
- Wrap `App` in `BrowserRouter` for client-side routing.
- Render `react-hot-toast` `Toaster` globally.
- Enable React `StrictMode` in development.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| (default export) | — | None; side-effect bootstrap only |
| `createRoot(...).render(...)` | React 18 API | Mounts the component tree |

# Internal Logic

1. Import global CSS (`./index.css`).
2. Render tree (outer → inner): `StrictMode` → `Provider(store)` → `BrowserRouter` → `Toaster` + `App`.

No local state or effects in this file.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| DOM element `#root` | Rendered React application |
| Redux `store` module | Store available to all descendants via context |
| `App` default export | Full routed UI |

# Dependencies

| Dependency | Usage |
|------------|--------|
| `react` / `react-dom/client` | `StrictMode`, `createRoot` |
| `react-router` | `BrowserRouter` |
| `react-redux` | `Provider` |
| `react-hot-toast` | `Toaster` |
| `./index.css` | Global/Tailwind/DaisyUI styles |
| `./App.jsx` | Root component |
| `./store/store.js` | Redux store instance |

# Used By

- Vite build (`index.html` script loads the bundle that executes this file). Nothing in `src/` imports `main.jsx`.

# API Connections

None directly. HTTP is configured in [`../services/axiosClient.md`](../services/axiosClient.md) and used by descendants.

# Database Connections

None.

# State/Context Dependencies

- Redux `Provider` — see [`../state/store.md`](../state/store.md).

# Related Files

- [`App.md`](./App.md)
- [`../state/store.md`](../state/store.md)
- `frontend/index.html`
- `frontend/src/index.css`

# Next Files To Read

1. [`App.md`](./App.md)
2. [`../state/store.md`](../state/store.md)
3. [`../../docs/FRONTEND_FLOW.md`](../../docs/FRONTEND_FLOW.md)

# Common Risks / Notes

- `Toaster` is mounted once here; components use `toast` from `react-hot-toast` without a local provider.
- Router uses `react-router` v7 package import path (`react-router`, not `react-router-dom`).

# Last Reviewed: 2026-05-18
