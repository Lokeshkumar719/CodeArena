# `frontend/src/components/problem/ResultPanel.jsx`

**Source:** `frontend/src/components/problem/ResultPanel.jsx`  
**Doc path:** `frontend_docs/components/problem/ResultPanel.md`

# File Purpose

Display full **submit** evaluation result on the right **result** tab.

# Responsibilities

- Show empty prompt when `submitResult` is null.
- Success card when `submitResult.accepted` with test counts, runtime, memory.
- Error card with `submitResult.error` when not accepted.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `ResultPanel` | default export | Submit results UI |
| Prop `submitResult` | object or null | From `ProblemPage` submit API |

Expected shape (from usage): `accepted`, `error`, `passedTestCases`, `totalTestCases`, `runtime`, `memory`.

# Internal Logic

Wrapper `.result-panel` → title "Submission Result" → conditional card with `.result-success` or `.result-error` classes.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `submitResult` | Result UI or placeholder paragraph |

# Dependencies

CSS classes from [`../../pages/ProblemPage.css.md`](../../pages/ProblemPage.css.md).

# Used By

- [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md) — when `activeRightTab === "result"`

# API Connections

Indirect: parent `POST /submission/submit/:problemId` populates `submitResult`.

# Database Connections

None.

# State/Context Dependencies

None (presentational).

# Related Files

- [`TestCasePanel.md`](./TestCasePanel.md) (run vs submit)
- [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md)

# Next Files To Read

1. Backend submit controller / Judge0 integration

# Common Risks / Notes

- Submit errors in parent catch set `submitResult` to `null` — user sees empty prompt, not error details.
- Uses class `result-empty` which is not styled in ProblemPage.css.

# Last Reviewed: 2026-05-18
