# `frontend/src/pages/Admin.jsx`

**Source:** `frontend/src/pages/Admin.jsx`  
**Doc path:** `frontend_docs/pages/Admin.md`

# File Purpose

Admin dashboard landing page: four cards linking to create, update, delete, and video management flows.

# Responsibilities

- Present static `adminOptions` configuration (title, description, icon, DaisyUI button color, route).
- Render responsive grid of cards with `NavLink` navigation.
- No API calls or Redux in this file.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `Admin` | default export | Dashboard UI |
| `adminOptions` | local array | Routes: `/admin/create`, `/admin/update-list`, `/admin/delete`, `/admin/video` |

Icons from `lucide-react`: `Plus`, `Edit`, `Trash2`, `Video`, `ArrowRight`.

# Internal Logic

Map `adminOptions` → card with icon, title, description, `NavLink` button to `option.route`.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| User navigation | Route change to child admin screens |

# Dependencies

| Package | Role |
|---------|------|
| `lucide-react` | Icons |
| `react-router` | `NavLink` |

# Used By

- [`App.md`](./App.md) — `/admin` (admin + authenticated)

# API Connections

None.

# Database Connections

None.

# State/Context Dependencies

None (route guard in `App` only).

# Related Files

- [`../components/AdminPanel.md`](../components/AdminPanel.md)
- [`../components/AdminUpdateList.md`](../components/AdminUpdateList.md)
- [`../components/AdminDelete.md`](../components/AdminDelete.md)
- [`../components/AdminVideo.md`](../components/AdminVideo.md)

# Next Files To Read

1. [`../components/AdminPanel.md`](../components/AdminPanel.md)
2. [`Homepage.md`](./Homepage.md) (admin entry from navbar)

# Common Risks / Notes

- No back link to homepage; users rely on browser back or navbar from other pages.
- Pure presentation; all CRUD happens on linked routes.

# Last Reviewed: 2026-05-18
