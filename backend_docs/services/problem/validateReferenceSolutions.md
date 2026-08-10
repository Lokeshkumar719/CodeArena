# `backend/src/services/problem/validateReferenceSolutions.js`

**Layer:** Service  
**Documented Source File:** `backend/src/services/problem/validateReferenceSolutions.js`  
**Purpose:** Validates that all reference solutions pass every test case via Judge0 before a problem is saved.  
**Last reviewed:** 2026-08-10

## Exported Function

### `validateReferenceSolutions(referenceSolution, testCases)`
- Iterates over each `{ language, completeCode }` in `referenceSolution`.
- Maps `language` → `languageId` via `getLanguageById()`.
- Creates Judge0 batch submissions with all `testCases` for each language.
- Submits via `judge0Service.submitBatch()`, polls via `judge0Service.submitToken()`.
- For each test result, checks `status_id === JUDGE0_STATUS.ACCEPTED`.
- Throws `ApiError(400)` if any test case fails for any language.

## Dependencies

- [../../utils/judge/judge0Utils.md](../../utils/judge/judge0Utils.md)
- [../execution/judge0Service.md](../execution/judge0Service.md)
- [../../constants/judgeStatus.md](../../constants/judgeStatus.md)
- [../../constants/statusCodes.md](../../constants/statusCodes.md)
- [../../utils/ApiError.md](../../utils/ApiError.md)

## Used By

- [../../controllers/problem/problemController.md](../../controllers/problem/problemController.md) — called during problem creation/update
