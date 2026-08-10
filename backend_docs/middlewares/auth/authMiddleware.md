# `backend/src/middlewares/auth/authMiddleware.js`

**Layer:** Middleware  
**Documented Source File:** `backend/src/middlewares/auth/authMiddleware.js`  
**Purpose:** Authenticates requests using the `accessToken` JWT cookie and fetches the user.  
**Last reviewed:** 2026-08-10

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

## Security Characteristics

- Depends on `httpOnly`, `sameSite` properties of the cookie to prevent XSS and CSRF.
- Does not authorize (check roles); it only authenticates.

## Errors Thrown

- `401` using `ApiError` class.

## Dependencies

- [../../services/auth/tokenService.md](../../services/auth/tokenService.md) — validates the signature and expiry.
- [../../models/user.md](../../models/user.md) — to fetch the current user document.
- [../../utils/ApiError.md](../../utils/ApiError.md) — standard error throwing.