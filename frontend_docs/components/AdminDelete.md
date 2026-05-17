# `frontend/src/components/AdminDelete.jsx`

**Source:** `frontend/src/components/AdminDelete.jsx`  
**Doc path:** `frontend_docs/components/AdminDelete.md`

# File Purpose

Paginated admin table to delete problems with confirmation dialog.

# Responsibilities

- List problems (paginated, 5 per page).
- `window.confirm` before delete.
- `DELETE` problem; optimistically remove row from local state; toast feedback.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `AdminDelete` | default export | Delete UI |
| `handleDelete` | async | Confirm + API delete |
| `deletingId` | state | Per-row loading on delete button |

# Internal Logic

- Fetch on `currentPage` change (same as AdminUpdateList).
- On successful delete: `setProblems(prev => prev.filter(...))` without refetch.
- Pagination inside table card footer.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| Problem `_id` | Removed from list or error toast |

# Dependencies

`axiosClient`, `react-hot-toast`, React state/effects.

# Used By

- [`../pages/App.md`](../pages/App.md) — `/admin/delete`

# API Connections

| Method | Path |
|--------|------|
| GET | `/problem/getAllProblems?page=&limit=5` |
| DELETE | `/problem/delete/:id` |

# Database Connections

None (frontend).

# State/Context Dependencies

Local: `problems`, `currentPage`, `totalPages`, `loading`, `deletingId`.

# Related Files

- [`AdminUpdateList.md`](./AdminUpdateList.md)
- [`AdminVideo.md`](./AdminVideo.md)

# Next Files To Read

1. Backend delete problem handler

# Common Risks / Notes

- Deleting last item on a page does not auto-decrement page or refetch — list may appear empty until user changes page.
- Uses `window.confirm` (blocking, not accessible modal component).

# Last Reviewed: 2026-05-18
