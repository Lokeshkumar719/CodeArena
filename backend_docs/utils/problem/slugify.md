# File Purpose

Utility to convert a problem title into a URL-friendly slug.

**Documented Source File:** `backend/src/utils/problem/slugify.js`

# Responsibilities

- Generate a safe, lowercase URL slug from arbitrary text.
- Remove special characters and replace spaces with hyphens.

# Main Functions / Components / Classes

| Export | Description |
|--------|-------------|
| `slugify(title)` | Takes a string `title` and returns the slugified version. |

# Internal Logic

1. Converts to lowercase.
2. Trims leading/trailing whitespace.
3. Removes all characters except `a-z`, `0-9`, spaces, and hyphens (`/[^a-z0-9\s-]/g`).
4. Replaces one or more spaces with a single hyphen (`/\s+/g`).

# Dependencies

None.

# Used By

- [../../controllers/problem/problemController.md](../../controllers/problem/problemController.md) - to generate `slug` during `createProblem` and `updateProblem`.

# Last Reviewed: 2026-08-10
