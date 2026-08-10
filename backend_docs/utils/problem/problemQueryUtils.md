# `backend/src/utils/problem/buildProblemQuery.js`

**Layer:** Utility  
**Documented Source File:** `backend/src/utils/problem/buildProblemQuery.js`  
**Purpose:** Builds MongoDB query filters and pagination from request query parameters for problem listing.  
**Last reviewed:** 2026-08-10

## Exported Functions

### `buildProblemQuery(params)`
Builds a MongoDB filter object from query parameters:

| Parameter | Filter Logic |
|-----------|-------------|
| `q` (numeric) | Exact match on `problemNo` (1–99999) |
| `q` (text) | `$text: { $search: q }` full-text search (max 150 chars) |
| `difficulty` | Exact match (`easy`, `medium`, `hard`) |
| `tags` | Comma-separated, matched via `$all` (AND logic) against `VALID_TAGS` |

Returns `{ filter, errors }` — `errors` is an array of validation messages (empty on success).

### `buildPagination(params)`
Parses `page` and `limit` from query params with defaults and bounds:

| Parameter | Default | Max |
|-----------|---------|-----|
| `page` | `1` | — |
| `limit` | `20` | `100` |

Returns `{ page, limit, skip }`.

## Dependencies

- [../../models/problem.md](../../models/problem.md) — `VALID_TAGS`

## Used By

- [../../services/problem/listProblems.md](../../services/problem/listProblems.md)
