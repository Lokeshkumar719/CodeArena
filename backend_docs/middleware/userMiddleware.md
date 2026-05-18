# File Purpose

Express middleware responsible for authenticating logged-in users using JWT cookies, Redis token blocklisting, and MongoDB user verification.

This middleware is the primary authentication layer for all protected user and admin routes.

# Responsibilities

- Verify JWT token from cookies
- Reject requests without authentication token
- Reject blocklisted/logout tokens using Redis
- Fetch authenticated user from MongoDB
- Attach authenticated user document to:
  js   req.user   
- Pass authenticated requests to downstream middleware/controllers

# Authentication Architecture

Authentication and authorization are intentionally separated.

## userMiddleware

Responsible for:
- authentication
- JWT verification
- Redis token validation
- user lookup

## adminMiddleware

Responsible only for authorization:

js id="0n7hsk" req.user.role === "admin" 

This separation avoids duplicated authentication logic and keeps middleware responsibilities clean.

# Main Functions / Components / Classes

| Export | Type |
|--------|------|
| userMiddleware | Express middleware wrapped with asyncHandler |

# Internal Logic

## Authentication Flow

1. Read JWT token from:
   js    req.cookies.token    

2. Reject missing token:
   js    401 Unauthorized Access    

3. Verify JWT:
   js    jwt.verify(token, process.env.JWT_KEY)    

### Important Note

jwt.verify():
- returns decoded payload if token is valid
- throws immediately if token is invalid or expired

Therefore no additional:
js if(!payload) 
check is required.

4. Extract:
   js    payload.id    

5. Fetch authenticated user:
   js    User.findById(id)    

6. Reject missing/deleted users

7. Check Redis token blocklist:
   js    redisClient.exists(`token:${token}`)    

8. Attach authenticated user:
   js    req.user = user    

9. Continue request lifecycle:
   js    next()    

# Inputs and Outputs

| Input | Success |
|-------|---------|
| Valid JWT cookie | req.user, next() |

| Failure | Status | Response |
|---------|--------|-----------|
| Missing token | 401 | "Unauthorized Access" |
| Invalid token | 401 | "Invalid Token" |
| Deleted user | 401 | "User Doesn't Exist" |
| Blocklisted token | 401 | "Invalid Token" |

# Dependencies

## npm Packages

- jsonwebtoken

## Internal Modules

- ../models/user
- ../config/redis
- ../utils/asyncHandler

# Used By

## Protected User Routes

### ../routes/userAuth.md
- /logout
- /profile
- /check

### ../routes/problemCreator.md
- problem reads
- solved problems
- submission history

### ../routes/submit.md
- run code
- submit code

### ../routes/videoCreator.md
- admin video routes (before adminMiddleware)

# API Connections

None directly.

Acts as authentication gatekeeper for protected REST endpoints.

# Database Connections

## MongoDB

js id="f0d3ha" User.findById() 

used for authenticated user validation.

## Redis

js id="p7mnct" redisClient.exists() 

used for JWT blocklist validation.

# State / Context Dependencies

- process.env.JWT_KEY
- req.cookies.token
- Redis connection availability
- MongoDB connection availability

# Related Files

- adminMiddleware.md
- ../routes/userAuth.md
- ../docs/AUTH_FLOW.md

# Next Files To Read

1. adminMiddleware.md
2. ../auth/userAuthenticate.md

# Common Risks / Notes

- Middleware assumes Redis connection is active for token blocklist checks.
- JWT payload stores role information at login/register time and does not auto-update if DB role changes later.
- jwt.verify() errors are forwarded through asyncHandler into centralized errorMiddleware.
- Middleware attaches full Mongoose user document, enabling downstream usage like:
  js   req.user.updateOne()   

# Last Reviewed: 2026-05-18