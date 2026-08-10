# `frontend/src/pages/Homepage.jsx`

**Source:** `frontend/src/pages/Homepage.jsx`  
**Doc path:** `frontend_docs/pages/Homepage.md`

# File Purpose

Authenticated dashboard showing a paginated, filterable, and searchable list of coding problems.

# Responsibilities

- Fetch and display the list of problems via `GET /problem/getProblems`.
- Handle filtering by difficulty, tags, and text search query.
- Maintain pagination state (current page, total pages).
- Provide a navigation bar with the `UserDropdown`.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `Homepage` | default export component | Full page UI |
| `fetchProblems` | async handler | Calls API with filters |

# Internal Logic

1. Retrieves `user` from Redux state.
2. Uses `useDebounce` to delay API calls while typing in the search box.
3. `useEffect` triggers `fetchProblems` when `currentPage`, `filters`, or the debounced query changes.
4. Handles logout via Redux `logoutUser()`.
5. Renders `ProblemListSkeleton` when loading, otherwise `ProblemCard`s for each result.
6. Problem links use `NavLink` to `/problem/:slug`.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `currentPage`, `filters`, `searchQuery` | Filtered list UI |
| `user` from Redux | Navbar name, admin link |
| Problem `slug` | `NavLink` to `/problem/:slug` |

# Dependencies

- `react-redux` - For `user` and `logoutUser`.
- `../hooks/useDebounce` - For search text input.
- `../utils/axiosClient` - `GET /problem/getProblems`.
- `../components/home/*` - Sub-components (`Pagination`, `ProblemCard`, `CustomSelect`, `UserDropdown`).

# Used By

- [`App.md`](./App.md) — route `/` (authenticated)

# API Connections

| Method | Path |
|--------|------|
| GET | `/problem/getAllProblems?page={n}&limit=5` |
| GET | `/problem/problemSolvedByUser` |

See [`../../docs/API_FLOW.md`](../../docs/API_FLOW.md).

# Database Connections

None in frontend; problems/users stored in MongoDB on server.

# State/Context Dependencies

- Redux: `state.auth.user` only (not `loading` here).

Local state: `problems`, `solvedProblems`, `currentPage`, `totalPages`, `totalProblems`, `filters`.

# Related Files

- [`ProblemPage.md`](./ProblemPage.md)
- [`Admin.md`](./Admin.md)
- [`../services/axiosClient.md`](../services/axiosClient.md)

# Next Files To Read

1. [`ProblemPage.md`](./ProblemPage.md)
2. Backend problem list controller (`../../backend_docs/` when available)

# Common Risks / Notes

- Filters apply to **current page only** (not server-side filter).
- Admin nav: `user?.role === "admin"` (case-sensitive) vs App’s `toLowerCase()` admin guard.
- Errors only `console.error`; no user-facing error UI.
- `tagOptions` duplicated in admin create/update forms.

# Last Reviewed: 2026-05-18
