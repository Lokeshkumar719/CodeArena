# `frontend/src/components/AdminVideo.jsx`

**Source:** `frontend/src/components/AdminVideo.jsx`  
**Doc path:** `frontend_docs/components/AdminVideo.md`

# File Purpose

Paginated list of problems with **Upload Video** action routing to per-problem upload screen.

# Responsibilities

- Same list/pagination pattern as AdminUpdateList.
- Navigate to `/admin/upload/:problemId` on button click.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `AdminVideo` | default export | List UI |
| `fetchProblems` | async | GET paginated problems |

# Internal Logic

Identical structure to AdminUpdateList except action button label/route (`/admin/upload/${problem._id}`).

# Inputs and Outputs

| Input | Output |
|-------|--------|
| Page index | Table + navigation to upload |

# Dependencies

`axiosClient`, `useNavigate`, React hooks.

# Used By

- [`../pages/App.md`](../pages/App.md) — `/admin/video`

# API Connections

| Method | Path |
|--------|------|
| GET | `/problem/getAllProblems?page=&limit=5` |

# Database Connections

None on this screen (upload happens in AdminUpload).

# State/Context Dependencies

Local: `problems`, `currentPage`, `totalPages`, `loading`, `error`.

# Related Files

- [`AdminUpload.md`](./AdminUpload.md)
- [`Editorial.md`](./Editorial.md) (plays uploaded video)

# Next Files To Read

1. [`AdminUpload.md`](./AdminUpload.md)

# Common Risks / Notes

- Duplicate list logic across AdminUpdateList, AdminDelete, AdminVideo — candidate for shared hook/component (none exists today).

# Last Reviewed: 2026-05-18
