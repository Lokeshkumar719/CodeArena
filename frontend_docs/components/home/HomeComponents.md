# Home Page Components

**Source Directory:** `frontend/src/components/home/`  
**Doc path:** `frontend_docs/components/home/HomeComponents.md`

# Overview

These components are small, focused UI elements used primarily on the `Homepage.jsx` (the authenticated problem list).

# Components

| Component | File | Responsibilities |
|-----------|------|------------------|
| `Chevron` | `Chevron.jsx` | A reusable SVG chevron icon used in dropdowns. |
| `CustomSelect` | `CustomSelect.jsx` | A custom dropdown selector for filtering problems by difficulty or tags. |
| `Pagination` | `Pagination.jsx` | Renders "Previous" and "Next" buttons, handling disabled states for the paginated problem list. |
| `ProblemCard` | `ProblemCard.jsx` | Renders an individual problem's summary in the list, linking to `/problem/:slug`. |
| `UserDropdown` | `UserDropdown.jsx` | Profile dropdown menu in the navbar for authenticated users (shows username, "Admin" if applicable, "Profile", and "Logout"). |

# Dependencies

- `react-router` - For navigation links.
- `../../styles/pages/homepageStyles` - JS-in-JS styles.
