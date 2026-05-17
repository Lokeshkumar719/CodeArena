# File Purpose

Mongoose schema and model for platform users (students and admins). Stores credentials, profile fields, and solved-problem references.

# Responsibilities

- Define user document shape and validation (email, name lengths, role enum)
- Index `emailId` for lookup performance
- Cascade-delete submissions when a user is deleted via `findOneAndDelete` hook

# Main Functions / Components / Classes

| Symbol | Description |
|--------|-------------|
| `userSchema` | Mongoose `Schema` definition |
| `User` | Model name `"user"` (lowercase) — `mongoose.model("user", userSchema)` |

### Schema fields (summary)

| Field | Notes |
|-------|-------|
| `firstName` | required, 3–20 chars, trim |
| `lastName` | optional, 3–20 |
| `emailId` | required, unique, lowercase, immutable, `validator.isEmail` |
| `age` | 5–80 optional |
| `role` | `"user"` \| `"admin"`, default `"user"` |
| `problemSolved` | `[ObjectId]` ref `'Problem'` |
| `password` | required string (hashed in controller) |
| timestamps | `createdAt`, `updatedAt` |

### Post hook

`userSchema.post('findOneAndDelete', ...)` deletes all `submission` documents where `userId` matches deleted user (`mongoose.model('submission')`).

# Internal Logic

- Email validation at schema level via `validator` package (defense in depth with [../utils/validate.md](../utils/validate.md))
- `problemSolved` updated from [../controllers/userSubmission.md](../controllers/userSubmission.md) via `$addToSet`

# Inputs and Outputs

| Operation | Typical caller |
|-----------|----------------|
| `User.create` | register, adminRegister |
| `User.findOne({ emailId })` | login |
| `User.findById` | middleware |
| `User.findByIdAndDelete` | deleteProfile |
| `populate('problemSolved')` | solvedProblems |

# Dependencies

**npm:** `mongoose`, `validator`

# Used By

- [../auth/userAuthenticate.md](../auth/userAuthenticate.md)
- [../middleware/userMiddleware.md](../middleware/userMiddleware.md)
- [../middleware/adminMiddleware.md](../middleware/adminMiddleware.md)
- [../controllers/problemsControllers.md](../controllers/problemsControllers.md)
- [../controllers/userSubmission.md](../controllers/userSubmission.md)

# API Connections

None (data layer only).

# Database Connections

**MongoDB collection:** `users` (Mongoose pluralization of model `user`)

# State/Context Dependencies

- Ref name `'Problem'` must match Problem model registration
- Hook uses model name `'submission'` (lowercase) — must match Submission model

# Related Files

- [submission.md](./submission.md) — cascade delete target
- [problems.md](./problems.md) — ref in `problemSolved`
- [../docs/DATABASE_FLOW.md](../docs/DATABASE_FLOW.md)

# Next Files To Read

1. [submission.md](./submission.md)
2. [../auth/userAuthenticate.md](../auth/userAuthenticate.md)

# Common Risks / Notes

- Password stored as string only; hashing is controller responsibility.
- `deleteProfile` uses `findByIdAndDelete` — **may not trigger** `findOneAndDelete` post hook (different middleware hook in Mongoose). Submissions might orphan depending on Mongoose version/API used.
- Model name `user` vs ref `Problem` casing — ensure refs resolve.

# Last Reviewed: 2026-05-18
