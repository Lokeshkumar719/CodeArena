# `backend/src/utils/auth/`

**Layer:** Utility  
**Documented Source Directory:** `backend/src/utils/auth/`  
**Purpose:** Authentication helper functions used by auth controllers and services.  
**Last reviewed:** 2026-08-10

## Files

| File | Export | Description |
|------|--------|-------------|
| `cookieOptions.js` | `accessTokenCookieOptions`, `refreshTokenCookieOptions` | Pre-built cookie option objects with `httpOnly`, `secure`, `sameSite`, and `maxAge`. Adapts to `NODE_ENV`. |
| `validatePassword.js` | `validatePassword(password)` | Validates password strength (8+ chars, uppercase, lowercase, number, symbol) via `validator.isStrongPassword()`. Throws `ApiError(400)` on failure. |
| `generateTokens.js` | `generateTokens(user)` | Creates `{ accessToken, refreshToken }` pair using `tokenService`. Payload: `{ id, emailId, role }`. |
| `clearAuthCookies.js` | `clearAuthCookies(res)` | Clears `accessToken` and `refreshToken` cookies from the response. |
| `removeRefreshSession.js` | `removeRefreshSession(userId)` | Deletes `refreshToken:<userId>` key from Redis. |
| `hashToken.js` | `hashToken(token)` | Returns SHA-256 hex digest of the input token. |
| `sendTokenResponse.js` | `sendTokenResponse(res, user, message, statusCode)` | Sends a standardised JSON response with user metadata (no tokens in body — tokens are in cookies). |

## Dependencies

- [../../constants/authConstants.md](../../constants/authConstants.md)
- [../../services/auth/tokenService.md](../../services/auth/tokenService.md)
- [../../config/redis.md](../../config/redis.md)
- [../ApiError.md](../ApiError.md)
- `validator` (npm)

## Used By

- [../../controllers/auth/authController.md](../../controllers/auth/authController.md)
- [../../services/auth/authService.md](../../services/auth/authService.md)
- [../../services/auth/refreshSessionService.md](../../services/auth/refreshSessionService.md)
