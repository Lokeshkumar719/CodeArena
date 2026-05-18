# File Purpose

Express middleware responsible for authorization of authenticated admin users.

This middleware assumes authentication has already been completed by:

js userMiddleware 

and only verifies whether the authenticated user has admin privileges.

# Responsibilities

- Restrict protected routes to admin users only
- Verify:
  js   req.user.role === "admin"   
- Return authorization failure response for non-admin users
- Pass authorized admin requests to next middleware/controller

# Authentication Architecture

Authentication and authorization are intentionally separated.

## userMiddleware

Responsible for:
- JWT verification
- Redis blocklist validation
- Fetching authenticated user from database
- Attaching:
  js   req.user   

## adminMiddleware

Responsible only for authorization logic.

This middleware depends on:

js req.user 

already being attached by userMiddleware.

# Main Functions / Components / Classes

| Export | Type |
|--------|------|
| adminMiddleware | Express middleware wrapped with asyncHandler |

# Internal Logic

## Authorization Flow

1. Assumes request already passed through:
   js    userMiddleware    

2. Verifies:
   js    req.user.role === "admin"    

3. If user is not admin:
   js    return res.status(403).send("Access Denied")    

4. Otherwise:
   js    next()    

# Inputs and Outputs

| Input | Success |
|-------|---------|
| Authenticated admin user | next() |

| Failure | Status | Response |
|---------|--------|-----------|
| Non-admin authenticated user | 403 | "Access Denied" |

# Dependencies

## Internal Modules

- ../utils/asyncHandler

# Used By

## Admin Routes

### ../routes/userAuth.md
- POST /admin/register

### ../routes/problemCreator.md
- Problem create/update/delete routes
- Admin problem fetch routes

### ../routes/videoCreator.md
- Video upload routes
- Video metadata routes
- Video deletion routes

# API Connections

None.

# Database Connections

None directly.

Database validation is handled earlier by:

js userMiddleware 

during authentication.

# State / Context Dependencies

Depends on:

js req.user 

being populated by userMiddleware.

Expected user shape:

js {   _id,   firstName,   emailId,   role } 

# Related Files

- userMiddleware.md
- ../auth/userAuthenticate.md
- ../docs/AUTH_FLOW.md

# Next Files To Read

1. userMiddleware.md
2. ../routes/problemCreator.md

# Common Risks / Notes

- adminMiddleware must always execute after userMiddleware.
- If req.user is missing, middleware ordering is incorrect.
- Authorization logic is intentionally separated from authentication logic for cleaner architecture and maintainability.
- Middleware returns plain-text responses rather than JSON error objects.

# Last Reviewed: 2026-05-18