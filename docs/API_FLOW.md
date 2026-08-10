# API Flow Map

**Base URL (dev):** `http://localhost:3000`  
**Client:** `frontend/src/utils/axiosClient.js` (`withCredentials: true`, intercepts 401 for refresh, 429 for rate limit)  
**Last reviewed:** 2026-05-29

## Route Mount Points

Defined in `backend/src/index.js`:

| Mount | Router file | Purpose |
|-------|-------------|---------|
| `/user` | `routes/auth/authRoutes.js` | Registration, login, logout, refresh, reset, check, email verification |
| `/problem` | `routes/problem/problemRoutes.js` | Problem CRUD + search/list + submission history |
| `/submission` | `routes/submission/submissionRoutes.js` | Run & submit code (rate limited) |
| `/video` | `routes/video/videoRoutes.js` | YouTube video metadata management |
| `/profile` | `routes/profile/profileRoutes.js` | User profile data retrieval and updates |
| `/api/stats` | `routes/statsRoutes.js` | Platform statistics |

## End-to-End Flows

### 1. User registration

```
Signup.jsx → dispatch(registerUser)
  → POST /user/register { username, emailId, password }
  → rateLimitMiddleware (limitRegister, IP-based, fixed window)
  → userAuthenticate.register → validate → bcrypt → User.create (unverified)
  → generate email verification token → hash → store in DB
  → send verification email via Resend API
  → return success message (User is NOT logged in)
```

**Email Verification:**
```
CheckEmail.jsx (Prompt user to check email)
User clicks link in email → GET /user/verify-email/:token
  → hash token → find user in DB
  → update user to verified → clear token fields
  → User can now log in
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
  → GET /problem/:slug
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
CreateProblem.jsx
  → POST /problem/create (userMiddleware, adminMiddleware, limitSubmitCode, uploadZipMiddleware)
       body includes inputFormat, outputFormat, constraints, test cases, startCode, referenceSolution
       file includes `hiddenTestCasesZip` (uploaded to R2)
       → validateReferenceSolutions against visible+hidden tests via Judge0
       → getNextProblemNo (atomic counter)
       → Problem.create({ problemNo, ...req.body, problemCreator: req.user._id })
```

### 9. Admin video upload

```
UploadVideoSolution.jsx
  → POST /video/upload/:problemId (userMiddleware, adminMiddleware)
  → Body contains { youtubeUrl }
  → Validate YouTube URL format
  → Save SolutionVideo to database
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
| GET | `/check` | `userMiddleware` | check Auth status |
| GET | `/verify-email/:token` | — | `verifyEmail` |
| POST | `/resend-verification` | `limitLogin` | `resendVerificationEmail` |
| POST | `/admin/Register` | `userMiddleware`, `adminMiddleware` | `adminRegister` |
| DELETE | `/profile` | `userMiddleware` | `deleteProfile` |

### `/problem`

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| POST | `/create` | `userMiddleware`, `adminMiddleware`, `limitSubmitCode`, `upload.single('hiddenTestCasesZip')` | `createProblem` |
| PATCH | `/update/:id` | `userMiddleware`, `adminMiddleware`, `limitSubmitCode`, `upload.single('hiddenTestCasesZip')` | `updateProblem` |
| DELETE | `/delete/:id` | `userMiddleware`, `adminMiddleware` | `deleteProblem` |
| GET | `/admin/problemById/:id` | `userMiddleware`, `adminMiddleware` | `getProblemByIdAdmin` |
| GET | `/:slug` | `userMiddleware` | `getProblemBySlug` |
| GET | `/getProblems` | `userMiddleware` | `getProblems` |
| GET | `/problemSolvedByUser` | `userMiddleware` | `solvedProblems` |
| GET | `/problemSubmmision/:id` | `userMiddleware` | `submittedProblem` |

### `/profile`

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| GET | `/me` | `userMiddleware` | `getMyProfile` |
| PATCH | `/me` | `userMiddleware` | `updateMyProfile` |
| GET | `/:username` | — | `getPublicProfile` |

### `/api/stats`

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| GET | `/` | — | `getPlatformStats` |

### `/submission`

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| POST | `/submit/:id` | `userMiddleware`, `limitSubmitCode` | `submitCode` |
| POST | `/run/:id` | `userMiddleware`, `limitRunCode` | `runCode` |

### `/video`

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| POST | `/upload/:problemId` | `userMiddleware`, `adminMiddleware` | `uploadVideo` |
| PUT | `/update/:problemId` | `userMiddleware`, `adminMiddleware` | `updateVideo` |
| DELETE | `/delete/:problemId` | `userMiddleware`, `adminMiddleware` | `deleteVideo` |

## External API Integrations

### Judge0 (Execution)
- Client: `backend/src/config/judge0Client.js` → `https://judge0-ce.p.rapidapi.com`
- Service: `submitBatch` POST `/submissions/batch`, `submitToken` GET poll until `status.id > 2`
- Payloads are **Base64 encoded** in both directions (`encodeBase64`/`decodeBase64`)
- Languages: cpp (54), java (62), javascript (63)

### Resend (Email)
- Service: `backend/src/services/auth/emailService.js`
- Used for: Sending forgot password links and email verification links

### Cloudflare R2 (Storage)
- Client: `backend/src/config/r2Client.js`
- Used for: Storing `hiddenTestCasesZip` files securely.
- Service: `storageServices.js` orchestrates uploads and deletions to the R2 bucket.

## Error Handling

- Global `errorMiddleware` handles generic errors (returns 500) and MongoDB duplicate keys (11000, returns 409).
- Controllers throw `ApiError` with specific HTTP status codes.
- `rateLimitMiddleware` returns 429 with `Retry-After` header.
- Frontend axios interceptor extracts `retryAfterSeconds` into `error.rateLimitedFor`.

## Related

- [AUTH_FLOW.md](./AUTH_FLOW.md)
- [BACKEND_FLOW.md](./BACKEND_FLOW.md)
- [DOC_INDEX.md](./DOC_INDEX.md)
