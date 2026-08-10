# `backend/src/constants/authConstants.js`

**Documented Source File:** `backend/src/constants/authConstants.js`  
**Purpose:** Centralised timing constants for the authentication system.  
**Last reviewed:** 2026-08-10

## Exported Object: `AUTH_CONFIG`

| Constant | Value | Description |
|----------|-------|-------------|
| `ACCESS_TOKEN_EXPIRES_IN` | `'15m'` | JWT `expiresIn` for access tokens |
| `REFRESH_TOKEN_EXPIRES_IN` | `'7d'` | JWT `expiresIn` for refresh tokens |
| `ACCESS_COOKIE_MAX_AGE` | `900000` (15 min ms) | `maxAge` for the `accessToken` cookie |
| `REFRESH_COOKIE_MAX_AGE` | `604800000` (7 days ms) | `maxAge` for the `refreshToken` cookie |
| `RESET_PASSWORD_TOKEN_EXPIRY` | `600000` (10 min ms) | Expiry window for password-reset tokens |
| `EMAIL_VERIFICATION_EXPIRY` | `7200000` (2 hr ms) | Expiry window for email verification tokens |

## Used By

- [../services/auth/authService.md](../services/auth/authService.md)
- [../services/auth/tokenService.md](../services/auth/tokenService.md)
- [../utils/auth/authUtils.md](../utils/auth/authUtils.md)
