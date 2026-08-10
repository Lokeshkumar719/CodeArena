# `frontend/src/services/statsService.js`

**Source:** `frontend/src/services/statsService.js`  
**Doc path:** `frontend_docs/services/statsService.md`

# File Purpose

Service module responsible for fetching platform-wide statistics.

# Responsibilities

- Export `getPlatformStats` function.
- Call `GET /stats/platform` via `axiosClient`.

# Internal Logic

Wraps the Axios call in a try/catch. Returns default values (`problems: 0, users: 0, submissions: 0, videos: 0`) if the API call fails, preventing the UI from crashing.

# Used By

- [`Stats.jsx`](../components/landing/LandingComponents.md) - Displayed on the unauthenticated landing page.
