# File Purpose

Business logic for DSA problem lifecycle: admin CRUD with Judge0-based reference-solution validation, paginated listing, user-facing reads, solved-problem tracking, and submission history per problem.

**Documented Source File:** `backend/src/controllers/problem/problemController.js`

# Responsibilities

- Validate reference solutions against visible test cases before create/update
- Persist and update Problem documents
- Return problem payloads with optional SolutionVideo metadata
- Paginate all problems for homepage rendering
- Populate solved problems for authenticated users
- Query submission history for a specific problem

# Authentication Flow

All protected controllers depend on middleware-driven authentication and authorization.

## authMiddleware

Responsible for:
- JWT verification
- Fetching authenticated user from database
- Attaching authenticated user document to `req.user`

## adminMiddleware

Responsible only for authorization (`req.user.role === "admin"`).

Admin-only controllers:
- `createProblem`
- `updateProblem`
- `deleteProblem`
- `getProblemByIdAdmin`

# Main Functions / Components / Classes

| Export | Purpose |
|--------|---------|
| `createProblem` | Judge0-validate each reference solution → `Problem.create` |
| `updateProblem` | Validate id + arrays → Judge0 → `findByIdAndUpdate` |
| `deleteProblem` | `findById` + `findByIdAndDelete` (and cleans up associated resources) |
| `getProblemByIdAdmin` | Full admin fields + hidden tests + video |
| `getProblemById` | User view (no hidden tests) + video |
| `getAllProblems` | Paginated listing via `listProblems` service |
| `solvedProblems` | User solved problems lookup |
| `submittedProblem` | Submission history for specific problem |

# Internal Logic

## Reference Solution Validation (Create / Update)

Delegates reference solution validation to `services/problem/validateReferenceSolutions.js`.

# Dependencies

- [../../services/problem/listProblems.md](../../services/problem/listProblems.md)
- [../../services/problem/validateReferenceSolutions.md](../../services/problem/validateReferenceSolutions.md)
- [../../models/problem.md](../../models/problem.md)
- [../../models/user.md](../../models/user.md)
- [../../models/submission.md](../../models/submission.md)
- [../../models/solutionVideo.md](../../models/solutionVideo.md)
- [../../utils/asyncHandler.md](../../utils/asyncHandler.md)

# Used By

- [../../routes/problem/problemRoutes.md](../../routes/problem/problemRoutes.md)

# Related Files

- [../../routes/problem/problemRoutes.md](../../routes/problem/problemRoutes.md)
- [../../models/problem.md](../../models/problem.md)
- [../../services/execution/judge0Service.md](../../services/execution/judge0Service.md)

# Last Reviewed: 2026-08-10