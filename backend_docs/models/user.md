# `backend/src/models/user.js`

**Layer:** Model (Mongoose)  
**Documented Source File:** `backend/src/models/user.js`  
**Purpose:** Mongoose schema and model for platform users. Stores credentials, profile fields, and solved-problem references.  
**Last reviewed:** 2026-08-10

## Responsibilities

- Define user document shape and validation (email, username, role enum).
- Index `emailId` for lookup performance.
- Provide a `pre('save')` hook to automatically hash passwords using `bcrypt`.
- Provide instance methods to generate tokens for email verification and password resets.
- Cascade-delete submissions when a user is deleted via `findOneAndDelete` hook.

## Schema Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `username` | String | required, unique, trim, min/max length, regex | User's handle (alphanumeric and underscores). |
| `emailId` | String | required, unique, trim, lowercase, immutable | Validated email address. Indexed. |
| `role` | String | enum: `['user', 'admin']` | Default is `'user'`. |
| `problemSolved` | Array | Ref: `Problem` | List of problem object IDs successfully solved by user. |
| `password` | String | required | Bcrypt-hashed password. |
| `isVerified` | Boolean | default: `false` | Whether email is verified. |
| `emailVerificationToken` | String | - | Hashed token for email verification. |
| `emailVerificationTokenExpires` | Date | - | Expiration of verification token. |
| `resetPasswordToken` | String | - | Hashed token for password resets. |
| `resetPasswordExpires` | Date | - | Expiration of reset token. |
| `bio` | String | trim, max 200 | User biography. |
| `institution` | String | trim, max 100 | User institution/company. |
| `createdAt`, `updatedAt` | Date | auto | Timestamps managed by Mongoose. |

## Hooks & Instance Methods

| Hook / Method | Description |
|---------------|-------------|
| `pre('save')` | Hashes `password` with `bcrypt` if modified before saving. |
| `post('findOneAndDelete')` | Hook to delete all submissions (`mongoose.model('submission').deleteMany`) for the deleted user. |
| `createResetPasswordToken()` | Generates a 32-byte hex string, hashes it with SHA-256 for storage, sets 10 min expiry, and returns the plain hex string. |
| `createEmailVerificationToken()`| Generates a 32-byte hex string, hashes it with SHA-256 for storage, sets 2 hr expiry, and returns the plain hex string. |

## Dependencies

- `mongoose`
- `validator` - for email validation
- `bcrypt` - for password hashing
- `crypto` - for generating and hashing random tokens
- `../constants/authConstants` - for token expiry durations

## Used By

- [../controllers/auth/authController.md](../controllers/auth/authController.md)
- [../middlewares/auth/authMiddleware.md](../middlewares/auth/authMiddleware.md)
- [../controllers/problem/problemController.md](../controllers/problem/problemController.md)
- [../controllers/submission/submissionController.md](../controllers/submission/submissionController.md)
