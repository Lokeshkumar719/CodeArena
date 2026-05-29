# `backend/src/services/auth/authService.js`

**Layer:** Service  
**Path:** `backend/src/services/auth/authService.js`  
**Purpose:** Core business logic for authentication (register, login, password resets).  
**Last reviewed:** 2026-05-29

## Overview

This service abstracts all database operations and cryptographic hashing related to user accounts away from the HTTP controllers. It returns structured objects that the controllers use to set cookies and respond to the client.

## Exported Functions

### `registerUser(data, defaultRole = "user")`
- Validates data with `validateUser(data)`
- Checks if `emailId` exists in DB → throws 400.
- Hashes password via `bcrypt`.
- Creates `User` document.
- Calls `tokenService.generateTokens(user)`.
- Calls `refreshSessionService.storeRefreshToken(...)`.
- Returns `{ accessToken, refreshToken, user }`.

### `loginUser(emailId, password)`
- Finds user by `emailId` (fails with 401 if not found).
- Compares `password` with DB hash via `bcrypt` (fails with 401 if wrong).
- Generates new tokens, stores refresh token in Redis.
- Returns `{ accessToken, refreshToken, user }`.

### `createPasswordResetToken(emailId)`
- Finds user by `emailId`.
- If user exists, generates a 32-byte crypto random string (`resetToken`).
- Hashes the token with SHA-256 and saves to `user.resetPasswordToken`.
- Sets `user.resetPasswordExpires` to `Date.now() + 10 * 60 * 1000` (10 minutes).
- Returns the unhashed `resetToken` for emailing.

### `resetPasswordWithToken(resetToken, newPassword)`
- Hashes `resetToken` with SHA-256.
- Finds user where `resetPasswordToken` matches the hash AND `resetPasswordExpires > Date.now()`.
- Throws 400 if token invalid or expired.
- Validates `newPassword` strength.
- Updates `password` (hashed with bcrypt), clears reset fields.
- Calls `refreshSessionService.invalidateSession(user._id)` to log them out of all devices.

### `changePassword(userId, oldPassword, newPassword)`
- Verifies `oldPassword`.
- Validates and updates `newPassword`.
- Does not invalidate existing sessions.

## Dependencies
- `models/user`
- `utils/validate`
- `utils/auth/validatePassword`
- `services/auth/tokenService`
- `services/auth/refreshSessionService`
