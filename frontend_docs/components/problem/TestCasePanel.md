# `frontend/src/components/problem/TestCasePanel.jsx`

**Source:** `frontend/src/components/problem/TestCasePanel.jsx`  
**Doc path:** `frontend_docs/components/problem/TestCasePanel.md`

# File Purpose

Display **run** (sample test) results on the right **testcase** tab, including per-case stdin/stdout and pass/fail.

# Responsibilities

- Empty state when `runResult` is null.
- Summary heading for all passed vs some failed.
- Optional runtime/memory on success.
- List `runResult.testCases` with Judge0-style fields.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `TestCasePanel` | default export | Run results UI |
| Prop `runResult` | object or null | From `ProblemPage` run API |

Expected fields: `success`, `runtime`, `memory`, `testCases[]` with `stdin`, `expected_output`, `stdout`, `status_id` (3 = pass).

# Internal Logic

- Pass/fail per case: `tc.status_id === 3` → `.tc-pass` "✓ Passed", else `.tc-fail`.
- Top-level success uses `runResult.success` for card styling (`.result-success` / `.result-error`).

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `runResult` | Test result breakdown |

# Dependencies

[`../../pages/ProblemPage.css.md`](../../pages/ProblemPage.css.md) — `.tc-card`, `.tc-row`, etc.

# Used By

- [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md) — `activeRightTab === "testcase"`

# API Connections

Indirect: parent `POST /submission/run/:problemId`.

# Database Connections

None.

# State/Context Dependencies

None.

# Related Files

- [`ResultPanel.md`](./ResultPanel.md)
- [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md)
- Backend Judge0 status constants

# Next Files To Read

1. Backend run submission handler
2. [`ResultPanel.md`](./ResultPanel.md)

# Common Risks / Notes

- Parent sets generic error object on HTTP failure — panel may show "Some test cases failed" without case details.
- `status_id === 3` is magic number tied to Judge0 accepted status.

# Last Reviewed: 2026-05-18
