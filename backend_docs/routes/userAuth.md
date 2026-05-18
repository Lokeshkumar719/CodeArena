# File Purpose

Express router responsible for authentication, session validation, admin registration, logout, and profile-management routes.

Mounted at **`/user`** in `backend/src/index.js`.

# Responsibilities

- Map authentication endpoints to controller handlers
- Apply middleware-based authentication and authorization
- Protect session-dependent routes
- Expose lightweight session validation endpoint (GET /check)
- Separate public routes from protected routes

# Authentication Architecture

Authentication and authorization are intentionally separated.

## userMiddleware

Responsible for:
- JWT verification
- Redis token blocklist validation
- Fetching authenticated user document
- Attaching:
  js   req.user   

## adminMiddleware

Responsible only for authorization:

js id="jlwm7" req.user.role === "admin" 

## Middleware Ordering

Admin-protected routes require:

js id="jlwm8" userMiddleware, adminMiddleware 

because:
- adminMiddleware depends on req.user
- req.user is attached by userMiddleware

# Main Functions / Components / Classes

| Route | Middleware | Handler |
|-------|------------|---------|
| POST /register | none | register |
| POST /login | none | login |
| POST /logout | userMiddleware | logout |
| POST /admin/Register | userMiddleware, adminMiddleware | adminRegister |
| DELETE /profile | userMiddleware | deleteProfile |
| GET /check | userMiddleware | inline session validation handler |

Exports:

js id="jlwm9" authRouter 

# Internal Logic

## Public Routes

### POST /register
- creates normal user accounts
- forces:
  js   role = "user"   
- returns JWT cookie

### POST /login
- validates credentials
- generates authenticated JWT cookie
- returns user metadata

These routes do NOT require authentication middleware.

# Protected Routes

## POST /logout

Requires authenticated session.

Flow:
- validates JWT
- blocklists token in Redis
- clears cookie

## DELETE /profile

Deletes authenticated user account using:

js req.user 

## POST /admin/register

Requires:
js userMiddleware, adminMiddleware 

Only authenticated admins can create additional admin accounts.

# GET /check

## Purpose

Frontend session bootstrap / session validation endpoint.

Used by:
- Redux auth initialization
- refresh persistence
- automatic login restoration

## Response Shape

Returns:

js id="jlwm0" {   user,   message: "valid user" } 

User object contains:
- firstName
- emailId
- _id
- role

All values are derived from:

js id="jlwm1" req.user 

# Inputs and Outputs

| Endpoint | Request | Response |
|----------|---------|-----------|
| POST /user/register | User body | 201 + cookie + user |
| POST /user/login | { emailId, password } | 201 + cookie + user |
| POST /user/logout | JWT cookie | 200 logout success |
| POST /user/admin/register | Admin body + admin JWT | 201 success |
| DELETE /user/profile | JWT cookie | 200 delete success |
| GET /user/check | JWT cookie | 200 session validation |

# Dependencies

## npm Packages

- express

## Internal Modules

- ../controllers/userAuthenticate
- ../middlewares/userMiddleware
- ../middlewares/adminMiddleware

# Used By

## Backend

- ../config/index.md

## Frontend

Authentication state management:
- authSlice.js
- login flow
- logout flow
- refresh persistence
- protected routing

# API Connections

Indirectly interacts with:
- JWT authentication flow
- Redis token blocklist
- MongoDB user system

See:
- ../docs/API_FLOW.md
- ../docs/AUTH_FLOW.md

# Database Connections

Handled indirectly through controllers:
- User
- Redis token blocklist

# State / Context Dependencies

- req.user
- JWT cookie
- Redis connection
- MongoDB connection
- process.env.JWT_KEY

# Related Files

- ../auth/userAuthenticate.md
- ../middleware/userMiddleware.md
- ../middleware/adminMiddleware.md
- ../database/user.md
- ../docs/AUTH_FLOW.md

# Next Files To Read

1. ../auth/userAuthenticate.md
2. ../middleware/userMiddleware.md

# Common Risks / Notes

- Route casing should remain consistent:
  txt   /admin/register   
  is preferred over mixed casing.

- GET /check is critical for frontend auth persistence and refresh restoration.

- Protected routes depend entirely on correct middleware ordering.

- JWT payload role information is generated during login/register and does not auto-update until next login.

- Commented-out getProfile route may be removed during future cleanup.

# Last Reviewed: 2026-05-18