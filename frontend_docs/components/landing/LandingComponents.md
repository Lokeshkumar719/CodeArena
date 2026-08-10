# Landing Page Components

**Source Directory:** `frontend/src/components/landing/`  
**Doc path:** `frontend_docs/components/landing/LandingComponents.md`

# Overview

These components are purely presentational blocks used to construct the unauthenticated `LandingPage.jsx`. They do not contain complex state, make API calls, or dispatch Redux actions.

# Components

| Component | File | Responsibilities |
|-----------|------|------------------|
| `Navbar` | `Navbar.jsx` | Fixed top navigation with logo, anchors, and "Login" / "Get Started" buttons. |
| `Hero` | `Hero.jsx` | Main hero section with primary call-to-action buttons. |
| `Features` | `Features.jsx` | Grid displaying key platform features with icons. |
| `TechStack` | `TechStack.jsx` | Displays the technologies used to build CodeArena (React, Node, MongoDB, Judge0). |
| `WhyCodeArena` | `WhyCodeArena.jsx` | "Why choose us" section with benefit cards. |
| `Stats` | `Stats.jsx` | Uses `statsService` to fetch and display dynamic platform statistics (problems, users, submissions). |
| `CTA` | `CTA.jsx` | Final call-to-action banner at the bottom of the page. |
| `Footer` | `Footer.jsx` | Simple footer with copyright text. |

# Dependencies

- `react-router` - For `Link` and `NavLink`.
- `react-icons/fa` - For icons.
- `tailwindcss` / `daisyui` - For styling.
- `../../services/statsService` - (Only in `Stats.jsx`).
