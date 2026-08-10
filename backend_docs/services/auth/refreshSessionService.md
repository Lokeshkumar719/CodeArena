# `backend/src/services/auth/refreshSessionService.js`

**Layer:** Service  
**Documented Source File:** `backend/src/services/auth/refreshSessionService.js`  
**Purpose:** Validates and rotates refresh token sessions using Redis.  
**Last reviewed:** 2026-08-10

## Overview

Implements **Refresh Token Rotation**. Every time a refresh token is used, it is invalidated and replaced with a new pair. This limits the damage of a stolen refresh token.

## Exported Function

### `refreshUserSession(refreshToken)`
The module exports this single function as `module.exports = refreshUserSession`.

1. Throws 401 if `refreshToken` is missing.
2. Verifies JWT signature via `verifyRefreshToken(refreshToken)`.
3. Extracts `id` from JWT payload.
4. Fetches stored hashed token from Redis (`refreshToken:<id>`).
5. Hashes incoming token via `hashToken()` and compares to stored hash.
6. Deletes old Redis key (`refreshToken:<id>`).
7. Generates new `accessToken` and `refreshToken` via `generateAccessToken`/`generateRefreshToken`.
8. Stores new hashed refresh token in Redis with TTL.
9. Returns `{ accessToken, refreshToken }`.

## Dependencies

- [../../config/redis.md](../../config/redis.md) — `redisClient`
- [tokenService.md](./tokenService.md) — `verifyRefreshToken`, `generateAccessToken`, `generateRefreshToken`
- [../../utils/auth/authUtils.md](../../utils/auth/authUtils.md) — `hashToken`
- [../../constants/authConstants.md](../../constants/authConstants.md) — `AUTH_CONFIG`
- [../../constants/statusCodes.md](../../constants/statusCodes.md)
- [../../utils/ApiError.md](../../utils/ApiError.md)
