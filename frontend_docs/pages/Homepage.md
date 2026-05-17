# `frontend/src/pages/Homepage.jsx`

**Source:** `frontend/src/pages/Homepage.jsx`  
**Doc path:** `frontend_docs/pages/Homepage.md`

# File Purpose

Authenticated home: paginated problem list, client-side filters, solved badges, logout, and admin nav for admin users.

# Responsibilities

- Fetch paginated problems and (if `user` exists) solved problem IDs.
- Client-side filter by difficulty, tag, solved/unsolved status.
- Pagination controls (5 problems per page from API).
- Navbar with user menu: Admin link (role `admin`), Logout.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `Homepage` | default export | Main page |
| `tagOptions` | constant array | Filter dropdown values (27 tags) |
| `getDifficultyBadgeColor` | helper | Maps difficulty → DaisyUI badge class |

# Internal Logic

1. `useEffect` on `[user, currentPage]`:
   - `GET /problem/getAllProblems?page=&limit=5` → `problems`, `totalPages`, `totalProblems`
   - If `user`: `GET /problem/problemSolvedByUser` → `solvedProblems`
2. `filteredProblems` = filter `problems` by `filters` (difficulty, tag, status vs `solvedProblems` by `_id`).
3. `handleLogout` → `dispatch(logoutUser())`, clears local `solvedProblems`.
4. Pagination: Previous/Next + numeric page buttons; display range text uses `currentPage * 5`.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `currentPage`, `filters` | Filtered card list UI |
| `user` from Redux | Navbar name, admin link, triggers solved fetch |
| Problem `_id` | `NavLink` to `/problem/:id` |

# Dependencies

| Module | Role |
|--------|------|
| `../utils/axiosClient` | Problem APIs |
| `../authSlice` | `logoutUser`, `user` |
| `react-redux`, `react-router` | State / links |

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
