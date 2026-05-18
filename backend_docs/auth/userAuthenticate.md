# File Purpose

Controller module for user registration, login, logout, admin registration, and account deletion. Implements JWT-in-cookie authentication with Redis-based token blocklisting for logout handling.

# Responsibilities

- Validate incoming request bodies using utils/validate
- Hash passwords securely using bcrypt (salt rounds: 10)
- Generate JWT tokens with identity and authorization data
- Store JWT inside secure HTTP-only cookies
- Block revoked tokens in Redis during logout
- Delete authenticated user accounts

# Main Functions / Components / Classes

| Export | Wrapped in asyncHandler | Role |
|--------|---------------------------|------|
| register | yes | Public signup, role forced to "user" |
| login | yes | Email/password authentication |
| logout | yes | Redis blocklist + cookie clear |
| adminRegister | yes | Admin-only user creation |
| deleteProfile | yes | Deletes authenticated user account |

# Internal Logic

### Register

1. validate(req.body) validates required fields and password rules
2. req.body.role = "user" prevents self-registration as admin
3. Password hashed using bcrypt.hash(password, 10)
4. User.create(req.body)
5. JWT payload stores:
   js    {      id,      emailId,      role: user.role    }    
6. JWT `expiresIn: "1d"`; cookie `maxAge: 24 * 60 * 60 * 1000`
7. Returns sanitized user object

### Login

1. Requires emailId and password
2. User.findOne({ emailId })
3. Password verified using bcrypt.compare
4. JWT payload stores role directly from database
5. Cookie returned with authenticated user data

### Logout

1. Read JWT token from cookies
2. jwt.decode(token) extracts expiration timestamp
3. Token added to Redis blocklist:
   js    redisClient.set(`token:${token}`,"blocked")    
4. Redis key expires automatically when JWT expires
5. Cookie cleared immediately

### Admin Register

1. Validates incoming body
2. Forces:
   js    req.body.role = "admin"    
3. Password hashed using bcrypt
4. JWT payload stores admin role from DB
5. Secure JWT cookie returned

### Delete Profile

Deletes authenticated user using:

js req.user._id 

Submission cleanup is handled through User model middleware/hooks.

# Authentication Architecture

Authentication and authorization are separated:

## userMiddleware

Responsible for:
- JWT verification
- Redis blocklist validation
- Fetching authenticated user from DB
- Attaching authenticated user to:
  js   req.user   

## adminMiddleware

Responsible only for authorization:

js req.user.role === "admin" 

# Inputs and Outputs

| Handler | Input | Output |
|---------|-------|--------|
| register | { firstName, emailId, password, ... } | Cookie + { user, message } |
| login | { emailId, password } | Cookie + authenticated user |
| logout | JWT cookie | "Logged Out Successfully" |
| adminRegister | validated admin body | "Admin Registered Successfully" |
| deleteProfile | req.user | "User deleted Successfully" |

Errors propagate through:

txt errorMiddleware 

which returns standardized error responses.

# Dependencies

## npm Packages

- bcrypt
- jsonwebtoken

## Internal Modules

- ../config/redis
- ../models/user
- ../utils/validate
- ../utils/asyncHandler

# API Connections

No external APIs used.

JWT signing and verification are handled locally using:

js process.env.JWT_KEY 

Redis is used for token revocation/blocklisting.

# Database Connections

## MongoDB

Uses User collection for:
- create
- find
- delete operations

## Redis

Stores revoked JWT tokens until their original expiry time.

# State / Context Dependencies

- process.env.JWT_KEY
- req.user
- req.cookies.token

# Related Files

- ../routes/userAuth.md
- ../utils/validate.md
- ../database/user.md
- ../config/redis.md
- ../docs/AUTH_FLOW.md

# Next Files To Read

1. ../middleware/userMiddleware.md
2. ../middleware/adminMiddleware.md
3. ../utils/validate.md

# Common Risks / Notes

- JWT payload is generated during login/register and does not auto-update if DB role changes later (re-login required).
- Logout uses `jwt.decode()` for `exp` (route is behind `userMiddleware`, which already verified the token).
- Unused import: `submission` model is required but not referenced in this file.
- `adminRegister` route requires `userMiddleware` + `adminMiddleware` (see [../routes/userAuth.md](../routes/userAuth.md)).

# Last Reviewed: 2026-05-18