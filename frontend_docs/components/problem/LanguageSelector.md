# `frontend/src/components/problem/LanguageSelector.jsx`

**Source:** `frontend/src/components/problem/LanguageSelector.jsx`  
**Doc path:** `frontend_docs/components/problem/LanguageSelector.md`

# File Purpose

Horizontal language picker (JavaScript, Java, C++) for the problem solver editor.

# Responsibilities

- Map `LANGS` entries to buttons.
- Highlight active language with `active-lang` vs `inactive` classes.
- Call `handleLanguageChange(language.key)` on click.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `LanguageSelector` | default export | Button row |
| Props | `LANGS`, `selectedLanguage`, `handleLanguageChange` | From `ProblemPage` via `CodeEditorPanel` |

# Internal Logic

`LANGS.map` → button with conditional class; `onClick` passes `language.key` (`javascript`, `java`, `cpp`).

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `selectedLanguage` | Active button styling |
| Click | `handleLanguageChange(key)` → parent resets starter code |

# Dependencies

None beyond React.

# Used By

- [`CodeEditorPanel.md`](./CodeEditorPanel.md)

# API Connections

None.

# Database Connections

None.

# State/Context Dependencies

Controlled by parent `selectedLanguage`.

# Related Files

- [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md) — defines `LANGS`
- [`../../pages/ProblemPage.css.md`](../../pages/ProblemPage.css.md) — `.lang-bar`, `.lang-btn`

# Next Files To Read

1. [`CodeEditorPanel.md`](./CodeEditorPanel.md)

# Common Risks / Notes

- Language keys must match `problem.startCode[].language` on the server.

# Last Reviewed: 2026-05-18
