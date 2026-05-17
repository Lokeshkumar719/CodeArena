# `frontend/src/components/problem/ActionBar.jsx`

**Source:** `frontend/src/components/problem/ActionBar.jsx`  
**Doc path:** `frontend_docs/components/problem/ActionBar.md`

# File Purpose

Run and Submit buttons for the code editor, with disabled/loading states during execution.

# Responsibilities

- Invoke parent handlers `handleRun` and `handleSubmitCode`.
- Disable both buttons when `isRunning` or `isSubmitting`.
- Show inline spinners and label text during active operations.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `ActionBar` | default export | Button group |
| Props | `isRunning`, `isSubmitting`, `handleRun`, `handleSubmitCode` | From `CodeEditorPanel` / `ProblemPage` |

# Internal Logic

Pure presentational: two `<button>` elements with class names `run-btn` and `submit-btn` (styled in [`../../pages/ProblemPage.css.md`](../../pages/ProblemPage.css.md)).

# Inputs and Outputs

| Input (props) | Output |
|---------------|--------|
| Click Run | `handleRun()` |
| Click Submit | `handleSubmitCode()` |

# Dependencies

None (React only).

# Used By

- [`CodeEditorPanel.md`](./CodeEditorPanel.md)

# API Connections

None (parent performs HTTP).

# Database Connections

None.

# State/Context Dependencies

None; controlled entirely by parent flags.

# Related Files

- [`CodeEditorPanel.md`](./CodeEditorPanel.md)
- [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md)

# Next Files To Read

1. [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md)

# Common Risks / Notes

- Buttons do not validate non-empty code before calling handlers.

# Last Reviewed: 2026-05-18
