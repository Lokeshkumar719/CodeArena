# `backend/src/services/auth/refreshSessionService.js`

**Layer:** Service  
**Path:** `backend/src/services/auth/refreshSessionService.js`  
**Purpose:** Manages long-lived refresh tokens using Redis.  
**Last reviewed:** 2026-05-29

## Overview

Refresh tokens grant long-term access (7 days) and are capable of generating new short-lived access tokens (15 minutes). To prevent stolen refresh tokens from being used indefinitely, they must be stored centrally (Redis) and rotated upon use.

## Exported Functions

### `storeRefreshToken(userId, refreshToken)`
- Hashes the `refreshToken` using SHA-256.
- Stores the hash in Redis under `refreshToken:<userId>`.
- Sets the TTL (Time-To-Live) to 7 days.
- **Security:** We hash the token before storing it. If Redis is compromised, attackers cannot extract plaintext refresh tokens to impersonate users.

### `rotateTokens(oldRefreshToken)`
- Verifies `oldRefreshToken` using `tokenService.verifyRefreshToken()`.
- Extracts `userId` from the JWT payload.
- Fetches the current active hash from Redis (`refreshToken:<userId>`).
- Hashes `oldRefreshToken` and compares it to the Redis value.
- If they don't match (or Redis is empty), the token is invalid/expired/stolen → throws 401.
- Generates a completely new `accessToken` and `refreshToken` pair.
- Overwrites the Redis key with the new `refreshToken` hash.
- Returns `{ newAccessToken, newRefreshToken }`.

### `invalidateSession(userId)`
- Deletes `refreshToken:<userId>` from Redis.
- Used during explicit logout and password resets.

## Why this architecture?
This implements **Refresh Token Rotation**. Every time a refresh token is used, it is invalidated and replaced. If a malicious actor steals a refresh token and uses it, the legitimate user will be unable to use their token (it won't match Redis), alerting them (via sudden logout) that their session was compromised.
