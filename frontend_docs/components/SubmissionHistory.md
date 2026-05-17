# `frontend/src/components/SubmissionHistory.jsx`

**Source:** `frontend/src/components/SubmissionHistory.jsx`  
**Doc path:** `frontend_docs/components/SubmissionHistory.md`

# File Purpose

Display paginated-style table of the current user's submissions for one problem, with a modal to view submitted code.

# Responsibilities

- Fetch submissions when `problemId` changes.
- Render status badges, runtime, memory, test case counts, timestamps.
- Modal detail view with code and optional `errorMessage`.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `SubmissionHistory` | default export | Table + modal |
| Props: `problemId` | string | Route problem id |
| `getStatusColor` | helper | Maps status → DaisyUI badge class |
| `formatMemory`, `formatDate` | helpers | Display formatting |

# Internal Logic

- `useEffect` → `GET /problem/problemSubmmision/:problemId` (spelling matches backend route in code).
- States: loading spinner, error alert, empty info alert, or table.
- `selectedSubmission` opens DaisyUI `modal modal-open` with `<pre><code>` source.

Status colors: `accepted`, `wrong`, `error`, `pending`, default neutral.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `problemId` prop | Submission list UI |
| Row "Code" button | Modal with full submission |

# Dependencies

`axiosClient`, React `useState` / `useEffect`.

# Used By

- [`../pages/ProblemPage.md`](../pages/ProblemPage.md) — left tab `submissions`

# API Connections

| Method | Path |
|--------|------|
| GET | `/problem/problemSubmmision/:problemId` |

Note: path uses typo **Submmision** (three m's) as in source.

# Database Connections

None (frontend); reads submission documents via API.

# State/Context Dependencies

Local only: `submissions`, `loading`, `error`, `selectedSubmission`.

# Related Files

- [`../pages/ProblemPage.md`](../pages/ProblemPage.md)
- Backend submission model / controller

# Next Files To Read

1. Backend `userSubmission` or problem routes
2. [`problem/ResultPanel.md`](./problem/ResultPanel.md)

# Common Risks / Notes

- Endpoint typo in URL must match backend mount path.
- Uses DaisyUI/Tailwind classes; embedded inside ProblemPage dark layout may look visually mixed.
- Button class `btn-s` may be typo for `btn-sm`.

# Last Reviewed: 2026-05-18
