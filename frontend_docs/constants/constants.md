# Constants

**Source Directory:** `frontend/src/constants/`  
**Doc path:** `frontend_docs/constants/constants.md`

# Overview

This directory contains static configuration objects and arrays used across the application to ensure consistency in dropdowns, filtering, and API requests.

# Files

### `filterOptions.js`
- `PAGE_LIMIT`: (Number) Default pagination limit (usually 5).
- `difficultyOptions`: Array of `{ label, value }` for the difficulty filter dropdown (Easy, Medium, Hard).

### `problemLanguages.js`
- `languageOptions`: Array of `{ label, value }` used in Admin forms (e.g., `value: "javascript"`).

### `problemTags.js`
- `tagOptions`: Array of `{ label, value }` representing all allowed problem categories (e.g., `Arrays`, `Dynamic Programming`, `Graphs`). Used in Create/Update forms and the Homepage filter.
