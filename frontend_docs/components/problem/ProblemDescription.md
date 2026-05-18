# `frontend/src/components/problem/ProblemDescription.jsx`

**Source:** `frontend/src/components/problem/ProblemDescription.jsx`  
**Doc path:** `frontend_docs/components/problem/ProblemDescription.md`

# File Purpose

Render problem title, difficulty/tags badges, description text, and visible test case examples on the left **description** tab.

# Responsibilities

- Display `problem.title`, `problem.description`.
- Map `problem.tags` to badge chips.
- Render **`inputFormat`**, **`outputFormat`**, and **`constraints`** when present (monospace cards).
- Render each `problem.visibleTestCases` entry as an example card (input, output, optional explanation).

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `ProblemDescription` | default export | Description UI |
| Props | `problem`, `getDifficultyBadge` | Problem object + class helper from parent |

# Internal Logic

1. Title + difficulty badge + tag chips.
2. Description paragraph (`whitespace-pre-wrap`).
3. Conditional sections for `inputFormat`, `outputFormat`, `constraints` (each in `example-card`).
4. Examples heading + `visibleTestCases.map` for input/output/explanation rows.

Assumes `visibleTestCases` is always an array (no optional chaining on `.map`).

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `problem` document from API | Formatted description panel |

# Dependencies

None (React only). CSS from [`../../pages/ProblemPage.css.md`](../../pages/ProblemPage.css.md).

# Used By

- [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md) — `activeLeftTab === "description"`

# API Connections

None (data loaded by parent).

# Database Connections

None.

# State/Context Dependencies

None (presentational).

# Related Files

- [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md)
- [`ProblemTabs.md`](./ProblemTabs.md)

# Next Files To Read

1. [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md)

# Common Risks / Notes

- `getDifficultyBadge` compares lowercase strings (`easy`, `medium`, `hard`); API casing must match parent helper.

# Last Reviewed: 2026-05-18
