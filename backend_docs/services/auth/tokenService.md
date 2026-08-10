# `backend/src/services/auth/tokenService.js`

**Layer:** Service  
**Documented Source File:** `backend/src/services/auth/tokenService.js`  
**Purpose:** Low-level JWT generation and verification for access and refresh tokens.  
**Last reviewed:** 2026-08-10

## Exported Functions

### `generateAccessToken(payload)`
- Signs `payload` with `JWT_KEY` using `AUTH_CONFIG.ACCESS_TOKEN_EXPIRES_IN` (`15m`).

### `generateRefreshToken(payload)`
- Signs `payload` with `JWT_REFRESH_KEY` using `AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_IN` (`7d`).

### `verifyAccessToken(token)`
- Verifies and decodes `token` against `JWT_KEY`. Throws on invalid/expired tokens.

### `verifyRefreshToken(token)`
- Verifies and decodes `token` against `JWT_REFRESH_KEY`. Throws on invalid/expired tokens.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `JWT_KEY` | Secret for access token signing |
| `JWT_REFRESH_KEY` | Secret for refresh token signing |

## Dependencies

- `jsonwebtoken` (npm)
- [../../constants/authConstants.md](../../constants/authConstants.md)

## Used By

- [refreshSessionService.md](./refreshSessionService.md)
- [../../utils/auth/authUtils.md](../../utils/auth/authUtils.md)
- [../../middlewares/auth/authMiddleware.md](../../middlewares/auth/authMiddleware.md)
