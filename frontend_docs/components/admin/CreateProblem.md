# `frontend/src/components/admin/CreateProblem.jsx`

**Source:** `frontend/src/components/admin/CreateProblem.jsx`  
**Doc path:** `frontend_docs/components/admin/CreateProblem.md`

# File Purpose

Admin form to create a new coding problem with metadata, visible/hidden test cases, and starter/reference code for C++, Java, and JavaScript.

# Responsibilities

- Validate full problem payload with Zod (`problemSchema`).
- Dynamic arrays for test cases via `useFieldArray`.
- Basic Information (`BasicInformationSection`)
- Visible Test Cases (`VisibleTestCasesSection`, `TestCaseBlock`)
- Hidden Test Cases (`HiddenTestCasesSection`)
- Code Templates (`CodeTemplatesSection`)
- POST created problem to backend; toast success; navigate to `/admin`.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `CreateProblem` | default export | Form UI container |
| `problemSchema` | Zod | Title, description, **inputFormat**, **outputFormat**, **constraints**, difficulty, tags, test cases, 3× startCode, 3× referenceSolution |
| `tagOptions` | array | Allowed tags (27 values) |
| `languageOptions` | array | cpp, java, javascript labels |

# Internal Logic

- `useForm` defaultValues include empty `inputFormat` / `outputFormat` / `constraints`, one visible/hidden case, and three language slots each for `startCode` / `referenceSolution`.
- Tags: `Controller` + multi-select; values must be in `tagOptions`.
- `onSubmit`: `setIsSubmitting(true)` → `POST /problem/create` with form `data` → `toast.success` → `navigate("/admin")`; errors via `toast.error`.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| Validated form object | API create request body |
| Success | Redirect + toast |

# Dependencies

`react-hook-form`, `useFieldArray`, `zod`, `axiosClient`, `react-hot-toast`, `react-router` (`useNavigate`, `NavLink`).

# Used By

- [`../pages/App.md`](../pages/App.md) — `/admin/create`

# API Connections

| Method | Path |
|--------|------|
| POST | `/problem/create` |

# Database Connections

None (frontend); backend writes `problems` collection.

# State/Context Dependencies

Local: `isSubmitting`. Form state via react-hook-form.

# Related Files

- [`AdminUpdate.md`](./AdminUpdate.md) (same schema shape)
- [`../pages/Admin.md`](../pages/Admin.md)

# Next Files To Read

1. Backend problem create route (`../../backend_docs/routes/` when available)
2. [`AdminUpdate.md`](./AdminUpdate.md)

# Common Risks / Notes

- `startCode` / `referenceSolution` indexed by `languageOptions` order in UI — must stay aligned with array indices 0..2.
- Large form; no draft save.

# Last Reviewed: 2026-05-18
