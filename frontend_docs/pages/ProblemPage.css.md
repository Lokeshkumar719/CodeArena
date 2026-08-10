# `frontend/src/pages/ProblemPage.css`

**Source:** `frontend/src/pages/ProblemPage.css`  
**Doc path:** `frontend_docs/pages/ProblemPage.css.md`  
**Documented as:** Styles companion to [`ProblemPage.md`](./ProblemPage.md)

# File Purpose

Scoped dark-theme layout and typography for the problem solver page (`.problem-page` root). Imports Google fonts Sora (UI) and JetBrains Mono (code blocks).

# Responsibilities

- Full-viewport column layout: top bar + 50/50 split panels.
- Style tabs, badges, examples, language bar, editor area, action bar, run/submit results, test case cards, solution cards.
- Loading spinner animation (`.loading-screen`, `.spinner`) — **defined here but not used by current `LoadingScreen.jsx`** (that component uses DaisyUI classes).

# Main Functions / Components / Classes

CSS classes (no JS exports). Key selectors:

| Class | Used by (in codebase) |
|-------|------------------------|
| `.problem-page`, `.split-layout`, `.panel-left`, `.panel-right` | `ProblemPage.jsx` |
| `.top-bar`, `.top-title` | `ProblemPage.jsx` |
| `.panel-content`, `.problem-title`, `.badge-*`, `.desc-text`, `.example-*` | `ProblemDescription.jsx`, inline solutions in `ProblemPage.jsx` |
| `.lang-bar`, `.lang-btn` | `LanguageSelector.jsx` |
| `.editor-wrap` | `CodeEditorPanel.jsx` |
| `.action-bar`, `.run-btn`, `.submit-btn` | `ProblemPage.jsx` |
| `.result-panel`, `.result-card`, `.tc-*` | `ResultPanel.jsx`, `TestCasePanel.jsx` |
| `.section-title`, `.solution-*` | `ProblemPage.jsx` solutions tab |
| `.tab-bar`, `.tab-btn` | **Not referenced in current JSX** — `ProblemTabs.jsx` uses Tailwind instead |

# Internal Logic

- Dark palette: background `#080c14`, panels `#0d1117` / `#111827`, borders `#1e2738`.
- Difficulty badges: `.badge-easy`, `.badge-medium`, `.badge-hard`, `.badge-tag`.
- Result states: `.result-success` / `.result-error` with matching heading colors.
- Judge-style testcase rows: `.tc-pass` (status) / `.tc-fail`.
- `@keyframes spin` for `.spinner`.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| Imported in `ProblemPage.jsx` | Global class rules under `.problem-page *` box-sizing |

# Dependencies

- Google Fonts CDN (`@import url(...)`)

# Used By

- [`ProblemPage.md`](./ProblemPage.md) — `import "./ProblemPage.css"`

# API Connections

None.

# Database Connections

None.

# State/Context Dependencies

None.

# Related Files

- All `frontend_docs/components/problem/*.md` that reference these class names
- [`ProblemPage.md`](./ProblemPage.md)

# Next Files To Read

1. [`../components/problem/ProblemTabs.md`](../components/problem/ProblemTabs.md) (styling mismatch note)
2. [`../components/problem/LoadingScreen.md`](../components/problem/LoadingScreen.md)

# Common Risks / Notes

- **Drift:** `ProblemTabs` no longer uses `.tab-bar` / `.tab-btn`; dead CSS unless tabs are refactored.
- **Drift:** `LoadingScreen` does not use `.loading-screen` / `.spinner` from this file.
- `.result-empty` referenced in `ResultPanel` / `TestCasePanel` but **not defined** in this CSS file (unstyled fallback text).
- Font import adds network dependency on Google Fonts.

# Last Reviewed: 2026-05-18
