# `frontend/src/components/problem/CodeEditorPanel.jsx`

**Source:** `frontend/src/components/problem/CodeEditorPanel.jsx`  
**Doc path:** `frontend_docs/components/problem/CodeEditorPanel.md`

# File Purpose

Right-panel code tab: language selector and Monaco editor.

# Responsibilities

- Wire Monaco `Editor` with theme and editor options.
- Compose `LanguageSelector`.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `CodeEditorPanel` | default export | Editor column |
| `@monaco-editor/react` `Editor` | component | Code editing |

Monaco options include: `vs-dark`, JetBrains Mono, no minimap, word wrap, `automaticLayout: true`, etc.

# Internal Logic

Flex column: `LanguageSelector` → `.editor-wrap` with full-height Editor.

`onMount` → `handleEditorDidMount` (stores editor in parent ref). `onChange` → `handleEditorChange`.

# Inputs and Outputs

| Prop | Role |
|------|------|
| `activeRightTab` | Visibility gate |
| `selectedLanguage`, `LANGS`, handlers | Language UI |
| `getLanguageForMonaco`, `code` | Editor language + value |
| `isRunning`, `isSubmitting`, run/submit handlers | Action bar |

# Dependencies

| Module | Role |
|--------|------|
| `@monaco-editor/react` | Editor |
| `./LanguageSelector` | Language buttons |
| `./LanguageSelector` | Language picker |

# Used By

- [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md)

# API Connections

None (parent calls submission APIs).

# Database Connections

None.

# State/Context Dependencies

Stateless; all state from `ProblemPage`.

# Related Files

- [`LanguageSelector.md`](./LanguageSelector.md)

- [`../../pages/ProblemPage.css.md`](../../pages/ProblemPage.css.md)

# Next Files To Read

1. [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md)
2. [`TestCasePanel.md`](./TestCasePanel.md)

# Common Risks / Notes

- Inline `style` flex layout on wrapper; rest uses CSS file classes.
- Editor `height="100%"` requires parent flex chain for correct sizing.

# Last Reviewed: 2026-05-18
