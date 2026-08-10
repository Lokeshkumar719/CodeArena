# `backend/src/controllers/profile/profileController.js`

**Layer:** Controller  
**Documented Source File:** `backend/src/controllers/profile/profileController.js`  
**Purpose:** HTTP handlers for user profile operations.  
**Last reviewed:** 2026-08-10

## Exported Handlers

### `getMyProfile` — `GET /api/profile/me`
- Requires authentication.
- Calls `getProfileService(req.user._id)`.
- Returns profile data including stats (problems solved, acceptance rate).

### `updateMyProfile` — `PATCH /api/profile/me`
- Requires authentication.
- Accepts `{ username, bio, institution }` in request body.
- Calls `updateProfileService(req.user._id, req.body)`.
- Returns updated profile data.

### `getPublicProfile` — `GET /api/profile/:username`
- Public endpoint (no auth required).
- Calls `getPublicProfileService(req.params.username)`.
- Returns public-facing profile data with stats.

## Dependencies

- [../../utils/asyncHandler.md](../../utils/asyncHandler.md)
- [../../services/profile/profileService.md](../../services/profile/profileService.md)
- [../../constants/statusCodes.md](../../constants/statusCodes.md)
