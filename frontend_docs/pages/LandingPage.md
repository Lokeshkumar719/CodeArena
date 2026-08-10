# `frontend/src/pages/LandingPage.jsx`

**Source:** `frontend/src/pages/LandingPage.jsx`  
**Doc path:** `frontend_docs/pages/LandingPage.md`

# File Purpose

The unauthenticated root page of the application (`/`). Presents the marketing, feature, and call-to-action sections to users who are not logged in.

# Responsibilities

- Compose the landing page sub-components into a single scrolling view.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `LandingPage` | default export | Page container |

# Internal Logic

Simply renders:
`Navbar` -> `Hero` -> `Features` -> `TechStack` -> `WhyCodeArena` -> `Stats` -> `CTA` -> `Footer`
inside a full-height container (`min-h-screen bg-base-100`).

# Dependencies

- `../components/landing/*`

# Used By

- [`App.jsx`](./App.md) - Renders at `/` when `isAuthenticated` is false.
