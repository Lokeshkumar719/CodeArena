# `backend/src/services/problem/listingProblems.js`

**Layer:** Service  
**Path:** `backend/src/services/problem/listingProblems.js`  
**Purpose:** Handles complex database querying for listing problems.  
**Last reviewed:** 2026-05-29

## Overview

Fetching the list of problems for the homepage is the most complex query in the application. It involves text searching, array intersections (tags), exact matching (difficulty/number), pagination, and crucially, calculating whether the requesting user has solved the problem.

## Exported Functions

### `listProblems(params, userId)`
- Takes `req.query` params and the `req.user._id`.
- Calls `buildProblemQuery(params)` and `buildPagination(params)` from `utils/buildProblemQuery.js`.
- If status filtering (`solved` / `unsolved`) is requested, it looks up the user's `Submission` documents to get an array of solved `problemId`s, and appends `$in` or `$nin` to the MongoDB filter.
- Executes two parallel queries:
  1. `Problem.countDocuments(filter)` — total count for pagination math.
  2. `Problem.find(filter).skip().limit().sort()` — fetching the actual page.
- Modifies the projection to exclude heavy fields (`hiddenTestCases`, `startCode`, `description`).
- Formats the resulting array, attaching an `isSolved: boolean` flag to each problem by cross-referencing the user's solved submissions.
- Returns `{ problems, pagination: { currentPage, totalPages, totalProblems, hasNextPage, hasPrevPage } }`.

## Complexity & Performance

To prevent the problem list from taking too long to load:
1. It relies heavily on Mongoose compound and text indexes.
2. It excludes heavy text fields from the `find` projection.
3. The `isSolved` annotation requires fetching all solved submissions for the user. As the application scales, this could become a bottleneck and may require caching or denormalizing the solved list.
