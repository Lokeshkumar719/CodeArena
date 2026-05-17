# File Purpose

Standalone Node script to seed the MongoDB `Problem` collection with five sample DSA problems for local development. Not part of the Express server runtime.

# Responsibilities

- Connect to MongoDB using `DB_CONNECT_STRING`
- `insertMany` predefined problem documents
- Exit process with code 0 or 1

# Main Functions / Components / Classes

| Symbol | Description |
|--------|-------------|
| `problems` | Array of 5 problem objects (titles, test cases, C++ reference solutions) |
| `seedProblems` | `async` IIFE function invoked at file bottom |
| `ADMIN_USER_ID` | Hardcoded string `"69c2c34650a877b51a020de6"` used as `problemCreator` |

### Seeded problem titles

1. Valid Parentheses (easy)
2. Top K Frequent Elements (medium)
3. Daily Temperatures (medium)
4. Trapping Rain Water (hard) — reference solution placeholder text
5. Course Schedule II (hard) — reference solution placeholder text

# Internal Logic

1. `dotenv.config()`
2. `mongoose.connect(MONGO_URI)`
3. `Problem.insertMany(problems)` — **no duplicate check**; re-run may duplicate or error on constraints
4. `process.exit(0)` on success, `process.exit(1)` on catch

Does not run Judge0 validation (unlike admin API create).

# Inputs and Outputs

| Input | Source |
|-------|--------|
| `process.env.DB_CONNECT_STRING` | `.env` |
| Hardcoded `ADMIN_USER_ID` | Must exist as User `_id` in DB for valid `problemCreator` ref |

| Output | Console |
|--------|---------|
| Success | `"MongoDB Connected"`, `"Problems Seeded Successfully"` |
| Failure | error logged, exit 1 |

# Dependencies

**npm:** `dotenv`, `mongoose`

**Internal:** `./models/problems` (relative to `src/seedProblems.js`)

# Used By

- Run manually: `node src/seedProblems.js` from `backend/` (not in `package.json` scripts)

# API Connections

None.

# Database Connections

- Direct `mongoose.connect` — does not use [../config/db.md](../config/db.md) `main()` export

# State/Context Dependencies

- Requires existing admin user with `_id === ADMIN_USER_ID` or creator ref may be invalid
- Placeholder reference solutions on 2 hard problems will fail if validated through admin API later

# Related Files

- [problems.md](./problems.md)
- [../config/db.md](../config/db.md)
- [../docs/GETTING_STARTED.md](../docs/GETTING_STARTED.md) (if documented)

# Next Files To Read

1. [problems.md](./problems.md)
2. [../controllers/problemsControllers.md](../controllers/problemsControllers.md) — production create path

# Common Risks / Notes

- **Not idempotent** — running twice inserts duplicates.
- Hardcoded Mongo user id is environment-specific; must be updated per deployment.
- Does not seed users, submissions, or videos.
- Items 4–5 have incomplete `completeCode` strings — fine for DB seed only, broken for Judge0 validation if created via API.

# Last Reviewed: 2026-05-18
