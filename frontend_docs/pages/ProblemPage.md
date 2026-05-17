# `frontend/src/pages/ProblemPage.jsx`

**Source:** `frontend/src/pages/ProblemPage.jsx`  
**Doc path:** `frontend_docs/pages/ProblemPage.md`

# File Purpose

Split-pane problem solver: description/editorial/solutions/submissions on the left; Monaco editor, run results, and submit results on the right.

# Responsibilities

- Load problem by route param `problemId`.
- Manage editor language, starter code, and user code state.
- Run code against sample tests and submit for full evaluation.
- Orchestrate child components and inline solutions tab markup.
- Apply layout styles from [`ProblemPage.css.md`](./ProblemPage.css.md).

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `ProblemPage` | default export | Page container |
| `getLanguageForMonaco` | helper | Maps `javascript` / `java` / `cpp` → Monaco language id |
| `getDifficultyBadge` | helper | CSS class for difficulty badges |
| `LANGS` | constant | Language picker options |
| `LEFT_TABS` / `RIGHT_TABS` | constants | Tab id lists |

# Internal Logic

**Fetch (deps `[problemId]` only):**  
`GET /problem/problemById/:problemId` → set `problem`, set `code` from `startCode` for current `selectedLanguage`.

**Language change (deps `[selectedLanguage, problem]`):** Reset `code` from `problem.startCode`.

**Run:** `POST /submission/run/:problemId` with `{ code, language }` → `runResult`, switch `activeRightTab` to `testcase`. On error, synthetic `{ success: false, error: 'Internal server error' }`.

**Submit:** `POST /submission/submit/:problemId` → `submitResult`, tab `result`. Catch clears `submitResult` but still opens result tab.

**Tabs:** Left — description, editorial (`Editorial`), solutions (inline maps `referenceSolution`), submissions (`SubmissionHistory`). Right — `CodeEditorPanel`, conditional `TestCasePanel` / `ResultPanel`.

**Loading:** If `loading && !problem`, render `LoadingScreen`.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `useParams().problemId` | Fetched problem document |
| User code / language | Run/submit API bodies |
| `runResult` / `submitResult` | Passed to result panels |

# Dependencies

| Import | Role |
|--------|------|
| `../utils/axiosClient` | HTTP |
| `SubmissionHistory`, `Editorial` | Left panel tabs |
| `problem/*` components | Layout, editor, panels |
| `./ProblemPage.css` | Scoped layout/theme |

# Used By

- [`App.md`](./App.md) — `/problem/:problemId` (no route-level auth)

# API Connections

| Method | Path | Body |
|--------|------|------|
| GET | `/problem/problemById/:problemId` | — |
| POST | `/submission/run/:problemId` | `{ code, language }` |
| POST | `/submission/submit/:problemId` | `{ code, language }` |

# Database Connections

None in frontend.

# State/Context Dependencies

All local React state (no Redux on this page):  
`problem`, `selectedLanguage`, `code`, `loading`, `isRunning`, `isSubmitting`, `runResult`, `submitResult`, `activeLeftTab`, `activeRightTab`, `editorRef`.

# Related Files

- [`ProblemPage.css.md`](./ProblemPage.css.md)
- [`../components/problem/*.md`](../components/problem/)
- [`../components/SubmissionHistory.md`](../components/SubmissionHistory.md)
- [`../components/Editorial.md`](../components/Editorial.md)

# Next Files To Read

1. [`../components/problem/CodeEditorPanel.md`](../components/problem/CodeEditorPanel.md)
2. [`ProblemPage.css.md`](./ProblemPage.css.md)
3. [`../../docs/API_FLOW.md`](../../docs/API_FLOW.md)

# Common Risks / Notes

- Initial fetch `useEffect` omits `selectedLanguage` from deps — first load uses default `javascript` for starter code only.
- Solutions tab shows `referenceSolution` when present; fallback message text may not match backend gating rules.
- Top bar title says "LeetLab · Problem Solver" while brand elsewhere is CodeArena.

# Last Reviewed: 2026-05-18
