# Authentication Flow

## Mechanism

Authentication uses:

- JWT stored inside secure httpOnly cookie
- Redis-based token blocklisting for logout invalidation
- MongoDB-backed user verification
- Middleware-based authentication + authorization separation

Cookie name:

txt id="jlwm1" token 

## Logout Strategy

Logout invalidates tokens using Redis:

txt id="jlwm2" token:<jwt> 

Redis keys expire automatically at JWT expiration time.

# Last Reviewed

txt id="jlwm3" 2026-05-18 

# Authentication Architecture

Authentication and authorization are intentionally separated.

## userMiddleware

Responsible for:
- JWT verification
- Redis blocklist validation
- Fetching authenticated user document
- Attaching:
  js   req.user   

## adminMiddleware

Responsible only for authorization:

js id="jlwm4" req.user.role === "admin" 

Admin routes require:

js id="jlwm5" userMiddleware, adminMiddleware 

This architecture avoids duplicated authentication logic and keeps middleware responsibilities isolated.

# Authentication Sequence Diagram

mermaid sequenceDiagram   participant Browser   participant FE as React + Redux   participant API as Express   participant Redis   participant DB as MongoDB    Note over Browser,DB: Register / Login    Browser->>FE: Submit credentials    FE->>API: POST /user/register or /login    API->>DB: Create or find user    API->>API: bcrypt hash/compare    API->>API: jwt.sign()    API->>Browser: Set-Cookie token (httpOnly, sameSite strict)    API-->>FE: { user }    FE->>FE: Redux auth state updated    Note over Browser,DB: Authenticated request    FE->>API: Request with credentials    API->>API: jwt.verify(token, JWT_KEY)    API->>Redis: EXISTS token:<jwt>    alt blocked token     API-->>FE: 401 Unauthorized   else valid token     API->>DB: User.findById(payload.id)      API->>API: req.user = authenticated user      API-->>FE: Protected response   end    Note over Browser,DB: Logout    FE->>API: POST /user/logout    API->>Redis: SET token:<jwt> blocked    API->>Redis: EXPIREAT payload.exp    API->>Browser: Clear cookie 

# JWT Payload

| Field | Source |
|-------|--------|
| id | User _id |
| emailId | User email |
| role | user.role from database |

## Important JWT Behavior

JWT payload is generated:
- during register
- during login

JWT payload values do NOT automatically update if database values change later.

Example:
- user promoted to admin in DB
- old JWT still contains old role
- user must login again for refreshed JWT payload

# Register vs Login Role Handling

## Register

During registration:

js id="jlwm6" req.body.role = "user" 

prevents users from self-registering as admins.

## JWT Payload

JWT payload always stores:

js id="jlwm7" role: user.role 

which keeps token authorization consistent with DB role.

# Middleware Flow

## Protected User Route

js id="jlwm8" userMiddleware 

## Protected Admin Route

js id="jlwm9" userMiddleware, adminMiddleware 

Example:

js id="jlwm0" router.post(   "/create",   userMiddleware,   adminMiddleware,   createProblem ); 

# Frontend Authentication State

## Redux Slice

txt id="jlwmq" frontend/src/authSlice.js 

## Main Thunks

- registerUser
- loginUser
- checkAuth
- logoutUser

## Store

txt id="jlwmw" store/store.js 

Auth state location:

txt id="jlwme" state.auth 

## Session Bootstrap

App.jsx dispatches:

js id="jlwmr" checkAuth() 

during application startup.

Frontend shows loading state while session validation completes.

# Client-side Route Guards

| Route | Guard |
|------|------|
| / | Requires authentication |
| /login, /signup | Redirect if already authenticated |
| /admin/* | Requires admin role |
| /problem/:id | Frontend accessible but backend still requires auth |

Backend authentication remains the actual security boundary.

# Admin Bootstrap

Admin creation endpoint:

txt id="jwjlwm" /user/admin/register 

Requirements:
- authenticated admin session
- userMiddleware
- adminMiddleware

Currently no frontend admin-registration UI exists.

# Security Notes

## Cookie Security

Cookie configuration:

js id="jlwmt" httpOnly: true sameSite: "strict" 

Benefits:
- frontend JavaScript cannot access JWT
- helps mitigate XSS token theft
- helps reduce CSRF risk

## Secure Flag

secure: true is currently omitted for local HTTP development.

Should be enabled during HTTPS production deployment.

## Password Validation

Registration validation uses:

txt id="jwylw1" validator.isStrongPassword 

inside:

txt id="jwylw2" utils/validate.js 

## Redis Logout Blocklist

Logout invalidates JWT reuse until original expiration time.

# Important Runtime Notes

- jwt.verify() throws immediately on invalid/expired JWT.
- req.user contains full Mongoose user document.
- Middleware ordering is critical:
  js   userMiddleware,   adminMiddleware   
- Redis availability is required for logout blocklist validation.

# Related Files

- backend_docs/auth/userAuthenticate.md
- backend_docs/middleware/userMiddleware.md
- frontend_docs/state/authSlice.md

# Future Improvements

Potential production-grade improvements:
- refresh-token rotation
- access/refresh token separation
- rate limiting for auth routes
- secure cookies in production
- centralized auth error responses
- token versioning
- OAuth integration

# Common Risks / Notes

- JWT role information becomes stale until next login if DB role changes.
- Long JWT expiry increases stolen-token exposure window.
- Redis outages can affect logout validation behavior.
- Frontend route guards are convenience UX only; backend middleware is actual security enforcement.

# Last Reviewed: 2026-05-18