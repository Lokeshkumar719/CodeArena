# `backend/src/services/problem/listProblems.js`

**Layer:** Service  
**Documented Source File:** `backend/src/services/problem/listProblems.js`  
**Purpose:** Handles complex database querying for listing problems with filtering, pagination, and solved-status annotation.  
**Last reviewed:** 2026-08-10

## Overview

Fetching the list of problems for the homepage is the most complex query in the application. It involves text searching, array intersections (tags), exact matching (difficulty/number), pagination, and crucially, calculating whether the requesting user has solved the problem.

## Exported Functions

### `listProblems(queryParams, userId)`
- Calls `buildProblemQuery(params)` and `buildPagination(params)` from `utils/problem/buildProblemQuery.js`.
- Supports `status` filtering (`solved` / `unsolved`) by querying the user's accepted `Submission` documents.
- Runs three parallel queries: `countDocuments`, `find` (with listing projection excluding heavy fields), and `SolutionVideo.find` (for `hasVideo` flag).
- Annotates each problem with `isSolved: boolean` and `hasVideo: boolean`.
- Returns `{ success, data: { pagination, problems } }` or `{ success: false, errors }`.

### Internal: `getSolvedProblemIds(userId)`
- Fetches distinct `problemId` values from accepted submissions for the user.
- Returns an array of `ObjectId`s.

## Dependencies

- [../../models/problem.md](../../models/problem.md)
- [../../models/submission.md](../../models/submission.md)
- [../../models/solutionVideo.md](../../models/solutionVideo.md)
- [../../utils/problem/problemQueryUtils.md](../../utils/problem/problemQueryUtils.md)

## Used By

- [../../controllers/problem/problemController.md](../../controllers/problem/problemController.md)
