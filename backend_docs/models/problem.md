# File Purpose

Mongoose schema and model for coding problems: metadata, visible/hidden test cases, starter code, reference solutions, and creator reference.

**Documented Source File:** `backend/src/models/problem.js`

# Responsibilities

- Store problem content for UI and Judge0 evaluation
- Constrain `difficulty` and `tags` to enumerated values
- Link to creating user via `problemCreator`

# Main Functions / Components / Classes

| Symbol | Description |
|--------|-------------|
| `problemSchema` | Main schema |
| `Problem` | `mongoose.model("Problem", problemSchema)` |
| `VALID_TAGS` | Exported array of allowed problem tags |

# Dependencies

**npm:** `mongoose`

# Used By

- [../controllers/problem/problemController.md](../controllers/problem/problemController.md)
- [../controllers/submission/submissionController.md](../controllers/submission/submissionController.md)
- [../controllers/video/videoController.md](../controllers/video/videoController.md)

# Related Files

- [user.md](./user.md)
- [submission.md](./submission.md)
- [solutionVideo.md](./solutionVideo.md)

# Last Reviewed: 2026-08-10
