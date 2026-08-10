# `backend/src/controllers/auth/authController.js`

**Layer:** Controller  
**Documented Source File:** `backend/src/controllers/auth/authController.js`  
**Purpose:** Handles user authentication requests, including registration, email verification, login, logout, profile deletion, and password management.  
**Last reviewed:** 2026-08-10

## Overview

This controller layer intercepts requests for the `/user` routes and delegates complex operations to `authService`, `emailService`, and `refreshSessionService`. It maps domain results back into standard HTTP responses, setting httpOnly cookies for access and refresh tokens.

## Endpoints Handled

| Method | Export | Route | Security |
|--------|--------|-------|----------|
| `POST` | `register` | `/user/register` | `limitRegister` |
| `GET` | `verifyEmail` | `/user/verify-email/:token` | — |
| `POST` | `resendVerificationEmail` | `/user/resend-verification` | `limitLogin` |
| `POST` | `login` | `/user/login` | `limitLogin` |
| `POST` | `logout` | `/user/logout` | `authMiddleware` |
| `GET` | *(inline)* | `/user/check` | `authMiddleware` |
| `POST` | `adminRegister` | `/user/admin/Register` | `authMiddleware`, `adminMiddleware` |
| `DELETE`| `deleteProfile` | `/user/profile` | `authMiddleware` |
| `POST` | `refreshAccessToken` | `/user/refresh` | — |
| `POST` | `forgotPassword` | `/user/forgot-password` | `limitLogin` |
| `POST` | `resetPassword` | `/user/reset-password/:token`| — |
| `POST` | `changePassword` | `/user/change-password` | `authMiddleware`, `limitChangePassword` |

## Core Behaviors

### 1. `register`
- Validates input via `validateUserRegistration(req.body)`
- Delegates to `authService.registerUser(req.body, "user")` which creates the `User` document
- Calls `user.createEmailVerificationToken()` and saves the user
- Sends verification email via `emailService` with the `verificationEmailTemplate`
- Returns 201 with a "verify your email" message (does **not** log the user in)

### 2. `verifyEmail`
- Hashes `req.params.token` with SHA-256
- Finds user matching the hashed token with unexpired `emailVerificationTokenExpires`
- Sets `isVerified = true`, clears verification fields
- Returns 200 success

### 3. `resendVerificationEmail`
- Requires `emailId` in body
- Finds user, checks not already verified
- Generates new verification token and sends email
- Returns 200 success

### 4. `login`
- Expects `emailId`, `password`
- Finds user, compares password with bcrypt
- Rejects if `!user.isVerified`
- Calls `authService.loginUser(user)` to generate tokens and store refresh session
- Sets `accessToken` and `refreshToken` cookies
- Returns 200 with user data via `sendTokenResponse`

### 5. `logout`
- Reads `refreshToken` from cookies
- Verifies it and deletes `refreshToken:<userId>` from Redis
- Clears auth cookies
- Returns 200

### 6. `refreshAccessToken`
- Reads `refreshToken` from cookies
- Calls `refreshUserSession(refreshToken)` (imported from `refreshSessionService`)
- Sets new access/refresh cookies on response
- Returns 200

### 7. `forgotPassword`
- Finds user by `emailId`
- Calls `user.createResetPasswordToken()` (instance method on User model)
- Sends reset email via `emailService` with `resetPasswordEmailTemplate`
- Returns 200

### 8. `resetPassword`
- Reads `req.params.token` and `req.body.password`
- Validates password strength via `validatePassword`
- Hashes token, finds user with matching unexpired token
- Updates password, clears reset fields
- Calls `removeRefreshSession(user._id)` and `clearAuthCookies(res)`
- Returns 200

### 9. `changePassword`
- Expects `currentPassword`, `newPassword`
- Validates new password, verifies current password
- Rejects if new password is same as current
- Updates password, calls `removeRefreshSession` and `clearAuthCookies`
- Returns 200

### 10. `adminRegister`
- Validates input, calls `registerUser({ ...req.body, isVerified: true }, "admin")`
- Returns 201 (admin is pre-verified, no email flow)

### 11. `deleteProfile`
- Deletes refresh session from Redis
- Deletes user via `User.findByIdAndDelete`
- Clears auth cookies
- Returns 200

## Dependencies

- [../../services/auth/authService.md](../../services/auth/authService.md) — `registerUser`, `loginUser`
- [../../services/auth/refreshSessionService.md](../../services/auth/refreshSessionService.md) — `refreshUserSession`
- [../../services/auth/tokenService.md](../../services/auth/tokenService.md) — `verifyRefreshToken`
- [../../services/auth/emailService.md](../../services/auth/emailService.md) — `sendEmail`
- [../../utils/auth/authUtils.md](../../utils/auth/authUtils.md) — `cookieOptions`, `clearAuthCookies`, `sendTokenResponse`, `removeRefreshSession`, `validatePassword`
- [../../utils/validation/validationUtils.md](../../utils/validation/validationUtils.md) — `validateUserRegistration`
- [../../models/user.md](../../models/user.md) — User model
- [../../utils/ApiError.md](../../utils/ApiError.md)
- [../../constants/statusCodes.md](../../constants/statusCodes.md)

## Status Codes

| Code | Usage |
|------|-------|
| 200 | Success (login, logout, verify, reset, change, check) |
| 201 | Created (register, admin register) |
| 400 | Validation errors, missing fields, invalid/expired tokens |
| 401 | Invalid credentials, unverified email |
| 404 | User not found |
| 500 | Verification email send failure |