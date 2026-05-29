# API Flow Map

**Base URL (dev):** `http://localhost:3000`  
**Client:** `frontend/src/utils/axiosClient.js` (`withCredentials: true`, intercepts 401 for refresh, 429 for rate limit)  
**Last reviewed:** 2026-05-29

## Route Mount Points

Defined in `backend/src/index.js`:

| Mount | Router file | Purpose |
|-------|-------------|---------|
| `/user` | `routes/userAuth.js` | Registration, login, logout, refresh, reset, check |
| `/problem` | `routes/problemCreator.js` | Problem CRUD + search/list + submission history |
| `/submission` | `routes/submit.js` | Run & submit code (rate limited) |
| `/video` | `routes/videoCreator.js` | Cloudinary upload signing & metadata |

## End-to-End Flows

### 1. User registration

```
Signup.jsx → dispatch(registerUser)
  → POST /user/register { firstName, emailId, password }
  → rateLimitMiddleware (limitRegister, IP-based, fixed window)
  → userAuthenticate.register → validate → bcrypt → User.create
  → authService.registerUser → generateTokens (access + refresh)
  → store hashed refresh token in Redis
  → Set-Cookie accessToken (15m), refreshToken (7d)
  → Redux auth.fulfilled → navigate /
```

### 2. User login & token refresh

```
Login.jsx → POST /user/login { emailId, password }
  → rateLimitMiddleware (limitLogin, IP-based)
  → bcrypt.compare → generateTokens → store in Redis → Set-Cookie
```
*(On access token expiry)*
```
Any authenticated request → 401 Unauthorized
  → axiosClient interceptor → POST /user/refresh
  → refreshSessionService → verify JWT, compare hash in Redis
  → rotate tokens: DEL old hash, SET new hash
  → Set-Cookie new tokens → retry original request
```

### 3. Password reset

```
ForgotPassword.jsx → POST /user/forgot-password { emailId }
  → generate reset token → hash → store in DB with expiry
  → sendEmail (Resend API)

ResetPassword.jsx → POST /user/reset-password/:token { password }
  → hash token → find user in DB
  → update password → invalidate refresh session → clear cookies
```

### 4. Problem list (homepage) with search/filter

```
Homepage.jsx
  → buildQueryString (page, limit, q, difficulty, tags, status)
  → GET /problem/getProblems?...
  → buildProblemQuery (parse text/num search, validate tags)
  → listingProblems (count, find, sort, paginate)
  → getSolvedProblemIds (Submission lookup) → add `isSolved` flag
```

### 5. Open problem & run code

```
ProblemPage.jsx
  → GET /problem/problemById/:id
  → POST /submission/run/:id { code, language }
       → rateLimitMiddleware (limitRunCode, userId-based token bucket)
       → visible test cases only → Judge0 batch → poll → JSON result
```

### 6. Submit solution

```
ProblemPage.jsx
  → POST /submission/submit/:id { code, language }
       → rateLimitMiddleware (limitSubmitCode, userId token bucket)
       → visible + hidden test cases → Submission document
       → Judge0 batch → poll
       → update submission + $addToSet problemSolved if accepted
```

### 7. Submission history

```
SubmissionHistory.jsx
  → GET /problem/problemSubmmision/:problemId
```

### 8. Admin create problem

```
AdminPanel.jsx
  → POST /problem/create (userMiddleware, adminMiddleware, limitSubmitCode)
       body includes inputFormat, outputFormat, constraints, test cases, startCode, referenceSolution
       → validateReferenceSolutions against visible+hidden tests via Judge0
       → getNextProblemNo (atomic counter)
       → Problem.create({ problemNo, ...req.body, problemCreator: req.user._id })
```

### 9. Admin video upload

```
AdminUpload.jsx
  → GET /video/create/:problemId (userMiddleware, adminMiddleware)
  → POST to Cloudinary (plain axios, not axiosClient)
  → POST /video/save (userMiddleware, adminMiddleware)
```

## Complete Endpoint Reference

### `/user` (auth)

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| POST | `/register` | `limitRegister` | `register` |
| POST | `/login` | `limitLogin` | `login` |
| POST | `/logout` | `userMiddleware` | `logout` |
| POST | `/refresh` | — | `refreshAccessToken` |
| POST | `/forgot-password` | `limitLogin` | `forgotPassword` |
| POST | `/reset-password/:token`| — | `resetPassword` |
| POST | `/change-password` | `userMiddleware`, `limitChangePassword` | `changePassword` |
| GET | `/check` | `userMiddleware` | inline JSON |
| POST | `/admin/Register` | `userMiddleware`, `adminMiddleware` | `adminRegister` |
| DELETE | `/profile` | `userMiddleware` | `deleteProfile` |

### `/problem`

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| POST | `/create` | `userMiddleware`, `adminMiddleware`, `limitSubmitCode` | `createProblem` |
| PUT | `/update/:id` | `userMiddleware`, `adminMiddleware`, `limitSubmitCode` | `updateProblem` |
| DELETE | `/delete/:id` | `userMiddleware`, `adminMiddleware` | `deleteProblem` |
| GET | `/admin/problemById/:id` | `userMiddleware`, `adminMiddleware` | `getProblemByIdAdmin` |
| GET | `/problemById/:id` | `userMiddleware` | `getProblemById` |
| GET | `/getProblems` | `userMiddleware` | `getProblems` |
| GET | `/problemSolvedByUser` | `userMiddleware` | `solvedProblems` |
| GET | `/problemSubmmision/:id` | `userMiddleware` | `submittedProblem` |

### `/submission`

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| POST | `/submit/:id` | `userMiddleware`, `limitSubmitCode` | `submitCode` |
| POST | `/run/:id` | `userMiddleware`, `limitRunCode` | `runCode` |

### `/video`

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| GET | `/create/:problemId` | `userMiddleware`, `adminMiddleware` | `generateUploadSignature` |
| POST | `/save` | `userMiddleware`, `adminMiddleware` | `saveVideoMetadata` |
| DELETE | `/delete/:problemId` | `userMiddleware`, `adminMiddleware` | `deleteVideo` |

## External API Integrations

### Judge0 (Execution)
- Client: `backend/src/config/judge0Client.js` → `https://judge0-ce.p.rapidapi.com`
- Service: `submitBatch` POST `/submissions/batch`, `submitToken` GET poll until `status.id > 2`
- Payloads are **Base64 encoded** in both directions (`encodeBase64`/`decodeBase64`)
- Languages: cpp (54), java (62), javascript (63)

### Resend (Email)
- Service: `backend/src/services/auth/emailService.js`
- Used for: Sending forgot password links

### Cloudinary (Video)
- Config: `backend/src/controllers/videoSection.js`
- Upload signature generation and media deletion

## Error Handling

- Global `errorMiddleware` handles generic errors (returns 500) and MongoDB duplicate keys (11000, returns 409).
- Controllers throw `ApiError` with specific HTTP status codes.
- `rateLimitMiddleware` returns 429 with `Retry-After` header.
- Frontend axios interceptor extracts `retryAfterSeconds` into `error.rateLimitedFor`.

## Related

- [AUTH_FLOW.md](./AUTH_FLOW.md)
- [BACKEND_FLOW.md](./BACKEND_FLOW.md)
- [DOC_INDEX.md](./DOC_INDEX.md)
