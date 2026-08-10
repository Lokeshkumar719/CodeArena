# `backend/src/services/profile/`

**Layer:** Service  
**Documented Source Directory:** `backend/src/services/profile/`  
**Purpose:** Business logic for user profile retrieval, update, and statistics.  
**Last reviewed:** 2026-08-10

## Files

### `profileService.js`

#### `getProfileService(userId)`
- Fetches user from DB (selected fields: `username`, `emailId`, `bio`, `institution`, `createdAt`, `problemSolved`).
- Calls `getProfileStats()` for computed statistics.
- Returns merged profile object.

#### `updateProfileService(userId, { username, bio, institution })`
- Validates input via `validateProfileUpdate()`.
- Checks new username against reserved usernames list and existing users.
- Updates and saves user document.
- Returns updated profile data.

#### `getPublicProfileService(username)`
- Finds user by `username` (public-facing fields only, excludes `emailId`).
- Calls `getProfileStats()` for computed statistics.
- Returns merged public profile object.

### `profileStatsService.js`

#### `getProfileStats(userId, solvedCount)`
- Runs parallel `countDocuments()` queries for total and accepted submissions.
- Computes `acceptanceRate` as `(accepted / total * 100)`.
- Returns `{ problemsSolved, totalSubmissions, acceptedSubmissions, acceptanceRate }`.

## Dependencies

- [../../models/user.md](../../models/user.md)
- [../../models/submission.md](../../models/submission.md)
- [../../constants/reservedUsernames.md](../../constants/reservedUsernames.md)
- [../../constants/statusCodes.md](../../constants/statusCodes.md)
- [../../utils/ApiError.md](../../utils/ApiError.md)
- [../../utils/validation/validationUtils.md](../../utils/validation/validationUtils.md) — `validateProfileUpdate`

## Used By

- [../../controllers/profile/profileController.md](../../controllers/profile/profileController.md)
