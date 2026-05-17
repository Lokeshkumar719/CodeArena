# File Purpose

MongoDB connection helper for the CodeArena backend. Exports a single async function that connects Mongoose to the database URI from the environment.

# Responsibilities

- Load `dotenv` when the module is required
- Call `mongoose.connect` with `process.env.DB_CONNECT_STRING`
- Export the connect function for use at server startup (`index.js`) and in standalone scripts (`seedProblems.js`)

# Main Functions / Components / Classes

| Export | Type | Description |
|--------|------|-------------|
| `main` (default) | `async function` | `await mongoose.connect(process.env.DB_CONNECT_STRING)` |

# Internal Logic

1. `require('dotenv').config()`
2. `mongoose` is required from `mongoose`
3. `main` performs a single `mongoose.connect` with no additional options, event handlers, or disconnect logic in this file

# Inputs and Outputs

| Input | Description |
|-------|-------------|
| `process.env.DB_CONNECT_STRING` | MongoDB connection string |

| Output | Description |
|--------|-------------|
| Resolved promise | Mongoose connected; no return value used by callers |
| Rejected promise | Propagates to `index.js` `initialiseConnection` catch or `seedProblems` catch |

# Dependencies

**npm:** `dotenv`, `mongoose`

# Used By

- [index.md](./index.md) — `backend/src/index.js` calls `main()` during `initialiseConnection`
- [../database/seedProblems.md](../database/seedProblems.md) — connects directly via `mongoose.connect` (duplicate pattern, does not import this file)

# API Connections

None. This module only opens a database connection.

# Database Connections

- **MongoDB** via Mongoose `mongoose.connect(process.env.DB_CONNECT_STRING)`
- Default connection pool and options are Mongoose defaults (not customized in this file)

# State/Context Dependencies

- `DB_CONNECT_STRING` must be set before `main()` runs
- Mongoose connection is process-global after connect

# Related Files

- [index.md](./index.md)
- [../database/user.md](../database/user.md)
- [../database/problems.md](../database/problems.md)
- [../database/submission.md](../database/submission.md)
- [../database/solutionVideo.md](../database/solutionVideo.md)
- [../docs/DATABASE_FLOW.md](../docs/DATABASE_FLOW.md)

# Next Files To Read

1. [../database/user.md](../database/user.md) — primary auth collection schema
2. [index.md](./index.md) — when connection runs relative to HTTP listen

# Common Risks / Notes

- No connection error handlers or retry logic in this file.
- No explicit `mongoose.connection.on('error')` logging here.
- `seedProblems.js` duplicates connect logic instead of reusing `main`.
- Connection is not closed on process shutdown from this module.

# Last Reviewed: 2026-05-18
