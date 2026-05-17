# `frontend/src/components/AdminUpdateList.jsx`

**Source:** `frontend/src/components/AdminUpdateList.jsx`  
**Doc path:** `frontend_docs/components/AdminUpdateList.md`

# File Purpose

Paginated table of problems with an **Update** button per row linking to the edit form.

# Responsibilities

- Fetch problems page (`limit=5`).
- Show loading spinner and error alert states.
- Navigate to `/admin/update/:problemId` on Update click.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `AdminUpdateList` | default export | List UI |
| `fetchProblems` | async function | GET paginated problems |
| `getDifficultyBadge` | helper | DaisyUI badge class |

# Internal Logic

- `useEffect` when `currentPage` changes → `fetchProblems`.
- Syncs `currentPage` from API response `data.currentPage`.
- Table columns: index, title, difficulty badge, tags, Update button.
- Pagination: Previous / Page X of Y / Next.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| Page number | Table rows |

# Dependencies

`axiosClient`, `react-router` (`useNavigate`), React `useState` / `useEffect`.

# Used By

- [`../pages/App.md`](../pages/App.md) — `/admin/update-list`

# API Connections

| Method | Path |
|--------|------|
| GET | `/problem/getAllProblems?page={page}&limit=5` |

# Database Connections

None (frontend).

# State/Context Dependencies

Local: `problems`, `currentPage`, `totalPages`, `loading`, `error`.

# Related Files

- [`AdminUpdate.md`](./AdminUpdate.md)
- [`AdminDelete.md`](./AdminDelete.md) (similar list pattern)

# Next Files To Read

1. [`AdminUpdate.md`](./AdminUpdate.md)

# Common Risks / Notes

- Same pagination endpoint as Homepage and other admin lists.

# Last Reviewed: 2026-05-18
