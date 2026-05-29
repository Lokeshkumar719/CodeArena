# `backend/src/middlewares/userMiddleware.js`

**Layer:** Middleware  
**Path:** `backend/src/middlewares/userMiddleware.js`  
**Purpose:** Authenticates requests using the `accessToken` JWT cookie and fetches the user.  
**Last reviewed:** 2026-05-29

## Overview

This middleware acts as the primary gatekeeper for protected routes. It relies exclusively on the short-lived `accessToken` cookie. If the access token expires, it rejects the request with a `401`, expecting the frontend interceptor to invoke the `/user/refresh` endpoint and retry.

## Flow

1. **Extract Token:** Reads `req.cookies.accessToken`.
   - If missing → throws `401 Unauthorized access`.
2. **Verify JWT:** Calls `tokenService.verifyAccessToken(token)`.
   - If expired/invalid → throws `401 Invalid token`.
3. **Database Lookup:** Uses `payload.id` to find the user in MongoDB.
   - If user deleted/not found → throws `401 User does not exist`.
4. **Attach to Request:** Sets `req.user = user`.
5. **Pass Control:** Calls `next()`.

## Changes from Previous Architecture

- **No Redis lookups:** The old architecture checked a Redis logout blocklist on every request. This is now removed. Session validity is tied purely to the short lifespan of the access token (15m). If an admin deletes a user, or a user logs out, their refresh token is deleted from Redis, preventing them from acquiring new access tokens, effectively terminating their session within 15 minutes.
- **Specific token lookup:** Only looks for `req.cookies.accessToken`, ignoring `req.cookies.refreshToken`.

## Security Characteristics

- Depends on `httpOnly`, `sameSite: strict` properties of the cookie to prevent XSS and CSRF.
- Does not authorize (check roles); it only authenticates.

## Errors Thrown

- `401` using `ApiError` class.

## Usage

```javascript
router.get("/problemById/:id", userMiddleware, getProblemById);
router.post("/submission/run/:id", userMiddleware, limitRunCode, runCode);
```

## Dependencies

- `services/auth/tokenService` — validates the signature and expiry.
- `models/user` — to fetch the current user document.
- `utils/ApiError` — standard error throwing.