# `frontend/src/components/AdminUpdate.jsx`

**Source:** `frontend/src/components/AdminUpdate.jsx`  
**Doc path:** `frontend_docs/components/AdminUpdate.md`

# File Purpose

Admin form to load an existing problem by id and update it with the same schema as create (`AdminPanel`).

# Responsibilities

- Fetch problem for edit: `GET /problem/admin/problemById/:id`.
- `reset(response.data)` into react-hook-form.
- PUT updated payload; toast; navigate to `/admin/update-list`.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `AdminUpdate` | default export | Update form |
| `problemSchema` | Zod | Same as AdminPanel |
| `useParams().id` | route param | Problem MongoDB id |

# Internal Logic

- `useEffect` on mount (empty deps array) fetches problem once.
- Loading gate: spinner until fetch completes.
- Hidden test cases `useFieldArray` uses `keyName: "fieldId"` (differs from AdminPanel).
- `onSubmit`: `PUT /problem/update/:id` with form data.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| Route `:id` | Pre-filled form |
| Submit | Updated problem on server |

# Dependencies

Same stack as AdminPanel + `useParams`, `reset` from react-hook-form.

# Used By

- [`../pages/App.md`](../pages/App.md) — `/admin/update/:id`

# API Connections

| Method | Path |
|--------|------|
| GET | `/problem/admin/problemById/:id` |
| PUT | `/problem/update/:id` |

# Database Connections

None (frontend).

# State/Context Dependencies

Local: `loading`, `isSubmitting`.

# Related Files

- [`AdminPanel.md`](./AdminPanel.md)
- [`AdminUpdateList.md`](./AdminUpdateList.md)

# Next Files To Read

1. [`AdminUpdateList.md`](./AdminUpdateList.md)
2. Backend admin problem-by-id handler

# Common Risks / Notes

- `useEffect` deps `[]` — changing `:id` without remount may show stale data.
- Update error toast uses `error.response?.data?.error` (create uses `.message`).

# Last Reviewed: 2026-05-18
