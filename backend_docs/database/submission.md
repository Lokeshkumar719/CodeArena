# File Purpose

Mongoose schema and model for code submission attempts: source code, language, judge outcome, and test-case statistics.

# Responsibilities

- Persist per-attempt submission records for history and analytics
- Index `(userId, problemId)` for efficient history queries
- Define allowed `language` and `status` enums

# Main Functions / Components / Classes

| Symbol | Description |
|--------|-------------|
| `submissionSchema` | Schema definition |
| `Submission` | `mongoose.model("submission", submissionSchema)` |

### Fields

| Field | Type / enum | Default |
|-------|-------------|---------|
| `userId` | ObjectId ref `"user"` | required |
| `problemId` | ObjectId ref `"Problem"` | required |
| `code` | String | required |
| `language` | `cpp`, `java`, `javascript` | required |
| `status` | `pending`, `accepted`, `wrong`, `error` | `pending` |
| `runtime` | Number | 0 |
| `memory` | Number | 0 |
| `testCasesPassed` | Number | 0 |
| `testCasesTotal` | Number | 0 |
| timestamps | — | auto |

**Compound index:** `{ userId: 1, problemId: 1 }`

# Internal Logic

- No hooks in this file
- User model deletes submissions on `findOneAndDelete` user hook

# Inputs and Outputs

| Operation | Caller |
|-----------|--------|
| `Submission.create` | `submitCode` |
| `save()` after Judge0 | `submitCode` |
| `Submission.find({ userId, problemId })` | `submittedProblem` |

# Dependencies

**npm:** `mongoose`

# Used By

- [../controllers/userSubmission.md](../controllers/userSubmission.md)
- [../controllers/problemsControllers.md](../controllers/problemsControllers.md)
- [user.md](./user.md) — cascade delete

# API Connections

None.

# Database Connections

**MongoDB collection:** `submissions` (Mongoose default for model `submission`)

# State/Context Dependencies

- Controller sets `errorMessage` on document but field **not in schema** — not persisted under strict mode

# Related Files

- [../controllers/userSubmission.md](../controllers/userSubmission.md)
- [user.md](./user.md)
- [problems.md](./problems.md)

# Next Files To Read

1. [../controllers/userSubmission.md](../controllers/userSubmission.md)

# Common Risks / Notes

- No unique constraint — multiple submissions per user/problem allowed (intended for history).
- `memory` from Judge0 may be KB; stored as number without unit documentation.
- Status `wrong` vs `error` distinction based on compile vs other failures in controller only.

# Last Reviewed: 2026-05-18
