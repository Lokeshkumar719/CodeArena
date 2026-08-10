# `backend/src/controllers/video/videoController.js`

**Layer:** Controller  
**Documented Source File:** `backend/src/controllers/video/videoController.js`  
**Purpose:** Admin-only CRUD for YouTube solution video links associated with problems.  
**Last reviewed:** 2026-08-10

## Overview

Manages YouTube video solution URLs linked to coding problems. Videos are stored as YouTube URLs (not uploaded to Cloudinary). Each problem can have at most one solution video.

## Exported Handlers

### `uploadVideo` — `POST /video/upload/:problemId`
- Validates `problemId` via `validateObjectId`.
- Checks problem exists.
- Checks no existing video for the problem (returns 409 Conflict if one exists).
- Creates `SolutionVideo` document with `{ problemId, userId, youtubeUrl }`.
- Returns 201 with created video data.

### `updateVideo` — `PUT /video/update/:problemId`
- Validates `problemId`.
- Updates the `SolutionVideo` document for the problem with new `youtubeUrl` and `userId`.
- Returns 404 if no video exists.
- Returns 200 with updated video data.

### `deleteVideo` — `DELETE /video/delete/:problemId`
- Validates `problemId`.
- Deletes the `SolutionVideo` document for the problem.
- Returns 404 if no video exists.
- Returns 200 success.

## Dependencies

- [../../models/problem.md](../../models/problem.md)
- [../../models/solutionVideo.md](../../models/solutionVideo.md)
- [../../utils/asyncHandler.md](../../utils/asyncHandler.md)
- [../../utils/validation/validationUtils.md](../../utils/validation/validationUtils.md) — `validateObjectId`
- [../../constants/statusCodes.md](../../constants/statusCodes.md)
- [../../utils/ApiError.md](../../utils/ApiError.md)

## Used By

- [../../routes/video/videoRoutes.md](../../routes/video/videoRoutes.md)

## Last Reviewed: 2026-08-10