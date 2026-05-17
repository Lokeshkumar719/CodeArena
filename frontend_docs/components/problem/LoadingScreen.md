# `frontend/src/components/problem/LoadingScreen.jsx`

**Source:** `frontend/src/components/problem/LoadingScreen.jsx`  
**Doc path:** `frontend_docs/components/problem/LoadingScreen.md`

# File Purpose

Full-screen loading indicator shown while `ProblemPage` fetches problem data.

# Responsibilities

- Centered DaisyUI spinner on `min-h-screen` with `bg-base-100`.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `LoadingScreen` | default export | Stateless spinner |

# Internal Logic

Single div with `loading loading-spinner loading-lg text-primary` — no props, no effects.

# Inputs and Outputs

None.

# Dependencies

DaisyUI utility classes (via global `index.css` / Tailwind config).

# Used By

- [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md) — when `loading && !problem`

# API Connections

None.

# Database Connections

None.

# State/Context Dependencies

None.

# Related Files

- [`../../pages/ProblemPage.css.md`](../../pages/ProblemPage.css.md) — defines `.loading-screen` / `.spinner` **not used** by this component

# Next Files To Read

1. [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md)

# Common Risks / Notes

- Visual style may differ from dark ProblemPage theme (uses `bg-base-100` not `.problem-page` background).
- CSS file contains alternate spinner styles that are currently unused here.

# Last Reviewed: 2026-05-18
