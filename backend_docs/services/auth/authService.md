# `backend/src/services/auth/authService.js`

**Layer:** Service  
**Documented Source File:** `backend/src/services/auth/authService.js`  
**Purpose:** Core business logic for user registration and login.  
**Last reviewed:** 2026-08-10

## Overview

This service handles user creation and login token generation. Password reset and change logic is handled directly in `authController.js` using User model instance methods.

## Exported Functions

### `registerUser(userData, role)`
- Creates a new `User` document with the provided `userData` and `role`.
- Password hashing is handled by the User model's `pre('save')` hook.
- Returns the created `user` document (caller handles email verification flow).

### `loginUser(user)`
- Accepts an already-found and validated `User` document.
- Calls `generateTokens(user)` to create access and refresh token pair.
- Calls `storeRefreshSession(user._id, refreshToken)` to hash and store the refresh token in Redis.
- Returns `{ accessToken, refreshToken }`.

## Internal Functions

### `storeRefreshSession(userId, refreshToken)`
- Hashes the refresh token via `hashToken()` (SHA-256).
- Stores in Redis under `refreshToken:<userId>` with TTL from `AUTH_CONFIG.REFRESH_COOKIE_MAX_AGE`.

## Dependencies

- [../../models/user.md](../../models/user.md)
- [../../config/redis.md](../../config/redis.md)
- [../../constants/authConstants.md](../../constants/authConstants.md)
- [../../utils/auth/authUtils.md](../../utils/auth/authUtils.md) — `generateTokens`, `hashToken`, `cookieOptions`
