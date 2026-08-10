# `backend/src/utils/validation/`

**Layer:** Utility  
**Documented Source Directory:** `backend/src/utils/validation/`  
**Purpose:** Input validation functions used across controllers and services.  
**Last reviewed:** 2026-08-10

## Files

| File | Export | Description |
|------|--------|-------------|
| `validateUserRegistration.js` | `validateUser(data)` | Validates registration payload: requires `username`, `emailId`, `password`. Checks email format, password strength, and username length (3–20 chars). |
| `validateObjectId.js` | `validateObjectId(id)` | Validates that `id` is a valid MongoDB ObjectId. Throws `ApiError(400)` otherwise. |
| `validateSubmissionInput.js` | `validateSubmissionInput(userId, problemId, code, language)` | Ensures all four fields are present. Throws `ApiError(400)` if any are missing. |
| `profileValidation.js` | `validateProfileUpdate({ username, bio, institution })` | Validates profile update fields: username 3–20 chars alphanumeric+underscore, bio ≤200 chars, institution ≤100 chars. |

## Dependencies

- `validator` (npm) — email and password strength validation
- `mongoose` — ObjectId validation
- [../ApiError.md](../ApiError.md)
- [../../constants/statusCodes.md](../../constants/statusCodes.md)

## Used By

- [../../services/auth/authService.md](../../services/auth/authService.md) — `validateUser`
- [../../controllers/submission/submissionController.md](../../controllers/submission/submissionController.md) — `validateSubmissionInput`
- [../../controllers/problem/problemController.md](../../controllers/problem/problemController.md) — `validateObjectId`
- [../../services/profile/profileService.md](../../services/profile/profileService.md) — `validateProfileUpdate`
