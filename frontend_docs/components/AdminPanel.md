# `frontend/src/components/AdminPanel.jsx`

**Source:** `frontend/src/components/AdminPanel.jsx`  
**Doc path:** `frontend_docs/components/AdminPanel.md`

# File Purpose

Admin form to create a new coding problem with metadata, visible/hidden test cases, and starter/reference code for C++, Java, and JavaScript.

# Responsibilities

- Validate full problem payload with Zod (`problemSchema`).
- Dynamic arrays for visible/hidden test cases via `useFieldArray`.
- POST created problem to backend; toast success; navigate to `/admin`.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `AdminPanel` | default export | Form page |
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

`react-hook-form`, `useFieldArray`, `zod`, `axiosClient`, `react-hot-toast`, `react-router` (`useNavigate`).

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
