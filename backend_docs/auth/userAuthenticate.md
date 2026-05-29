# `backend/src/controllers/userAuthenticate.js`

**Layer:** Controller  
**Path:** `backend/src/controllers/userAuthenticate.js`  
**Purpose:** Handles user authentication requests, including registration, login, logout, profile deletion, and password resets.  
**Last reviewed:** 2026-05-29

## Overview

This controller layer intercepts requests for the `/user` routes and delegates complex operations (like hashing, DB interactions, and JWT signing) to the `authService`, `refreshSessionService`, and `emailService`. It maps domain results back into standard HTTP responses, setting httpOnly cookies for access and refresh tokens.

## Endpoints Handled

| Method | Export | Route | Security |
|--------|--------|-------|----------|
| `POST` | `register` | `/user/register` | `limitRegister` |
| `POST` | `login` | `/user/login` | `limitLogin` |
| `POST` | `logout` | `/user/logout` | `userMiddleware` |
| `GET` | *(inline)* | `/user/check` | `userMiddleware` |
| `POST` | `adminRegister` | `/user/admin/Register` | `userMiddleware`, `adminMiddleware` |
| `DELETE`| `deleteProfile` | `/user/profile` | `userMiddleware` |
| `POST` | `refreshAccessToken` | `/user/refresh` | — |
| `POST` | `forgotPassword` | `/user/forgot-password` | `limitLogin` |
| `POST` | `resetPassword` | `/user/reset-password/:token`| — |
| `POST` | `changePassword` | `/user/change-password` | `userMiddleware`, `limitChangePassword` |

## Core Behaviors

### 1. `register`
- Expects `firstName`, `emailId`, `password`
- Delegates to `authService.registerUser(req.body, "user")`
- Destructures `accessToken`, `refreshToken`, `user` from service
- Calls `setAuthCookies(res, accessToken, refreshToken)`
- Returns 201 with `user` object

### 2. `login`
- Expects `emailId`, `password`
- Delegates to `authService.loginUser(emailId, password)`
- Sets cookies and returns 200 with `user` object

### 3. `logout`
- Requires `req.user._id` (from `userMiddleware`)
- Calls `refreshSessionService.invalidateSession(req.user._id)` to clear Redis
- Calls `clearAuthCookies(res)`
- Returns 200 `Logged out successfully`

### 4. `refreshAccessToken`
- Reads `refreshToken` from cookies
- Validates it's not missing, then calls `refreshSessionService.rotateTokens(req.cookies.refreshToken)`
- Sets new access/refresh cookies on response
- Important for silent token rotation.

### 5. `forgotPassword`
- Expects `emailId`
- Calls `authService.createPasswordResetToken(emailId)`
- Calls `emailService.sendPasswordResetEmail(emailId, resetToken)`
- Returns success even if email not found (security practice)

### 6. `resetPassword`
- Reads `req.params.token` and `req.body.password`
- Calls `authService.resetPasswordWithToken(req.params.token, req.body.password)`
- Invalidates active sessions in Redis
- Clears cookies on response

### 7. `changePassword`
- Expects `oldPassword`, `newPassword`
- Calls `authService.changePassword(req.user._id, oldPassword, newPassword)`
- Does not clear sessions, just updates the password

## Cookie Management

`setAuthCookies(res, access, refresh)`:
- Sets `accessToken` with `accessTokenCookieOptions` (15m)
- Sets `refreshToken` with `refreshTokenCookieOptions` (7d)

`clearAuthCookies(res)`:
- Clears both cookies using standard Express `res.clearCookie`

## Dependencies

- `services/auth/authService.js` — business logic
- `services/auth/refreshSessionService.js` — Redis session state
- `services/auth/emailService.js` — Resend integration
- `utils/ApiError.js` — custom errors caught by `errorMiddleware`

## Status Codes

| Code | Usage |
|------|-------|
| 200 | Success (login, logout, delete, checks, changes) |
| 201 | Created (registration) |
| 400 | Validation errors, missing fields, invalid passwords |
| 401 | Missing/invalid tokens during refresh |
| 404 | User not found (sometimes masked for security) |
| 500 | Server/Redis/DB errors |