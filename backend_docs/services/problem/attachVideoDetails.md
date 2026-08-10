# `backend/src/services/problem/attachVideoDetails.js`

**Layer:** Service  
**Documented Source File:** `backend/src/services/problem/attachVideoDetails.js`  
**Purpose:** Enriches a problem object with its associated solution video (if any).  
**Last reviewed:** 2026-08-10

## Exported Function

### `attachVideoDetails(problem, problemId)`
- Queries `SolutionVideo.findOne({ problemId })`.
- Returns a new object merging the problem's fields with `videoSolution: { youtubeUrl }` (or `null` if no video exists).

## Dependencies

- [../../models/solutionVideo.md](../../models/solutionVideo.md)

## Used By

- [../../controllers/problem/problemController.md](../../controllers/problem/problemController.md) — when fetching a single problem's details
