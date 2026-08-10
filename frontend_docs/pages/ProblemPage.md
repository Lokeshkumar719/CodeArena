# `frontend/src/pages/ProblemPage.jsx`

**Source:** `frontend/src/pages/ProblemPage.jsx`  
**Doc path:** `frontend_docs/pages/ProblemPage.md`

# File Purpose

Split-pane problem solver: description/editorial/solutions/submissions on the left; Monaco editor, run results, and submit results on the right.

# Responsibilities

- Load problem by route param `slug`.
- Manage editor language, starter code, user code state, and `codeReady` synchronization.
- Implement rate limiting (`useRateLimit`) for Run and Submit actions.
- Provide keyboard shortcuts (Cmd/Ctrl + ' for Run, Cmd/Ctrl + Enter for Submit).
- Run code against sample tests and submit for full evaluation.
- Orchestrate child components and inline solutions tab markup.
- Apply layout styles from [`ProblemPage.css.md`](./ProblemPage.css.md).

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `ProblemPage` | default export | Page container |
| `getLanguageForMonaco` | helper | Maps `javascript` / `java` / `cpp` → Monaco language id |
| `getDifficultyBadge` | helper | CSS class for difficulty badges |
| `LANGS` | constant array | Inline language picker options |
| `LEFT_TABS` / `RIGHT_TABS` | constants | Tab id lists |

# Internal Logic

**Fetch (deps `[slug]`):**  
`GET /problem/:slug` → set `problem`, set `code` from `startCode` for current `selectedLanguage`, set `codeReady(true)`.

**Language change (deps `[selectedLanguage, problem]`):** Reset `code` from `problem.startCode`.

**Run:** Checks `runRateLimit`. `POST /submission/run/:slug` with `{ code, language }` → `runResult`, switch `activeRightTab` to `testcase`. Catch checks for 429 and starts cooldown.

**Submit:** Checks `submitRateLimit`. `POST /submission/submit/:slug` → `submitResult`, switch `activeRightTab` to `result`. Catch checks for 429 and starts cooldown.

**Keyboard Shortcuts:** `useEffect` listens for `keydown`. Prevents default and triggers Run/Submit handlers if `codeReady` and not already running/submitting.

**Tabs:** Left — description, editorial (`Editorial`), solutions, submissions (`SubmissionHistory`). Right — `CodeEditorPanel`, conditional `TestCasePanel` / `ResultPanel`. The action bar (Run/Submit) is rendered inline at the bottom of the right panel, outside of the editor component itself.

**Loading:** If `loading && !problem`, render `LoadingScreen`.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `useParams().slug` | Fetched problem document |
| User code / language | Run/submit API bodies |
| `runResult` / `submitResult` | Passed to result panels |

# Dependencies

- `react-redux`
- `react-router` (`useParams`)
- `react-hot-toast`
- `../hooks/useRateLimit`
- `../utils/axiosClient`
- `../components/problem/*`

# Used By

- [`App.jsx`](./App.md) - Renders at `/problem/:slug`.
