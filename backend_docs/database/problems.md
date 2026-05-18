# File Purpose

Mongoose schema and model for coding problems: metadata, visible/hidden test cases, starter code, reference solutions, and creator reference.

# Responsibilities

- Store problem content for UI and Judge0 evaluation
- Constrain `difficulty` and `tags` to enumerated values
- Link to creating user via `problemCreator`

# Main Functions / Components / Classes

| Symbol | Description |
|--------|-------------|
| `problemSchema` | Main schema |
| `Problem` | `mongoose.model("Problem", problemSchema)` |

### Notable schema structure

- `description`: required string (problem statement)
- `inputFormat`, `outputFormat`, `constraints`: required strings (LeetCode-style sections)
- `visibleTestCases[]`: `{ input, output, explanation }` (all required)
- `hiddenTestCases[]`: `{ input, output }` (no explanation field)
- `startCode[]`: `{ language, initialCode }`
- `referenceSolution[]`: `{ language, completeCode }`
- `problemCreator`: ObjectId ref `"User"` (set from `req.user._id` on create)

### Tags enum

Includes: `array`, `string`, `stack`, `queue`, `hashing`, `sorting`, `binarySearch`, `twoPointers`, `slidingWindow`, `recursion`, `backtracking`, `greedy`, `heap`, `trie`, `graph`, `dfs`, `bfs`, `dp`, `bitManipulation`, `math`, `prefixSum`, `matrix`, `unionFind`, `segmentTree`, `topologicalSort`, `shortestPath`.

# Internal Logic

- No instance methods or hooks on schema
- **Dead import:** `const { init } = require("./user")` — `init` is not defined or used in `user.js` (likely accidental)

# Inputs and Outputs

CRUD via [../controllers/problemsControllers.md](../controllers/problemsControllers.md) and seed script.

# Dependencies

**npm:** `mongoose`

**Internal:** `./user` imported but unused (`init`)

# Used By

- [../controllers/problemsControllers.md](../controllers/problemsControllers.md)
- [../controllers/userSubmission.md](../controllers/userSubmission.md)
- [../controllers/videoSection.md](../controllers/videoSection.md)
- [../database/seedProblems.md](../database/seedProblems.md)
- User schema `problemSolved` ref

# API Connections

None.

# Database Connections

**MongoDB collection:** `problems` (default pluralization of `Problem`)

# State/Context Dependencies

- `problemCreator` required on every document
- Tag values must match enum or Mongoose validation fails on save

# Related Files

- [user.md](./user.md)
- [submission.md](./submission.md)
- [solutionVideo.md](./solutionVideo.md)
- [../controllers/problemsControllers.md](../controllers/problemsControllers.md)

# Next Files To Read

1. [../controllers/problemsControllers.md](../controllers/problemsControllers.md)
2. [submission.md](./submission.md)

# Common Risks / Notes

- `ref: "User"` vs actual model name `"user"` — population may fail unless refPath corrected.
- Hidden tests never exposed on user `getProblemById` (controller select), not schema-level security.
- Seed data includes placeholder reference solutions for some hard problems.

# Last Reviewed: 2026-05-18
