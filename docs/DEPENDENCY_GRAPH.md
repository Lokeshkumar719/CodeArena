# Dependency Graph

**Last reviewed:** 2026-05-29

## Backend Import Graph (simplified)

```
index.js
├── config/db.js
├── config/redis.js
├── routes/userAuth.js → middlewares/rateLimitMiddleware.js
│                      → middlewares/userMiddleware.js
│                      → middlewares/adminMiddleware.js
│                      → controllers/userAuthenticate.js
├── routes/problemCreator.js → controllers/problemsControllers.js
├── routes/submit.js → controllers/userSubmission.js
├── routes/videoCreator.js → controllers/videoSection.js
└── middlewares/errorMiddleware.js

controllers/userAuthenticate.js → services/auth/*, utils/auth/*, models/user.js, config/redis.js
controllers/problemsControllers.js → services/problem/*, models/problem.js, models/reusableProblemNo.js
controllers/userSubmission.js → services/executionService.js, utils/getExecutionLimits.js
controllers/videoSection.js → models/solutionVideo.js, cloudinary

services/executionService.js → services/judge0Service.js, utils/getSubmissionResult.js
services/judge0Service.js → config/judge0Client.js, utils/decodeBase64.js, utils/encodeBase64.js

middlewares/rateLimitMiddleware.js → config/redis.js, rate-limiter-flexible
middlewares/userMiddleware.js → services/auth/tokenService.js, models/user.js
```

## Frontend Import Graph (simplified)

```
main.jsx → App.jsx, store/store.js
store/store.js → authSlice.js → utils/axiosClient.js

App.jsx → pages/*, components/Admin*, nprogress

pages/Homepage.jsx → axiosClient, authSlice, components/skeletons/ProblemListSkeleton
pages/ProblemPage.jsx → axiosClient, hooks/useRateLimit, components/problem/*, SubmissionHistory, Editorial

pages/ForgotPassword.jsx, pages/ResetPassword.jsx → axiosClient, react-hook-form, zod
pages/Login.jsx, pages/Signup.jsx → authSlice, react-hook-form, zod

components/problem/CodeEditorPanel.jsx → @monaco-editor/react
components/Admin*.jsx → axiosClient, react-hook-form, zod, components/skeletons/*
```

## Cross-Stack Coupling

| Frontend module | Backend endpoint(s) |
|-----------------|---------------------|
| `authSlice` | `/user/register`, `/user/login`, `/user/logout`, `/user/check` |
| `axiosClient` | `/user/refresh` (in interceptor) |
| `ForgotPassword` | `/user/forgot-password` |
| `ResetPassword` | `/user/reset-password/:token` |
| `ChangePassword`| `/user/change-password` |
| `Homepage` | `/problem/getProblems` |
| `ProblemPage` | `/problem/problemById/:id`, `/submission/run/:id`, `/submission/submit/:id` |
| `SubmissionHistory` | `/problem/problemSubmmision/:id` |
| `AdminPanel` | `/problem/create` |
| `AdminUpdate` | `/problem/admin/problemById/:id`, `/problem/update/:id` |
| `AdminDelete` | `/problem/delete/:id` |
| `AdminUpload` | `/video/create/:id`, Cloudinary, `/video/save` |

## External Runtime Dependencies

```
Backend ──► MongoDB (DB_CONNECT_STRING)
Backend ──► Redis (REDIS_URL)
Backend ──► Judge0 RapidAPI (RAPID_API_KEY)
Backend ──► Cloudinary API (CLOUDINARY_*)
Backend ──► Resend API (RESEND_API_KEY)
Frontend ──► Backend HTTP API (localhost:3000)
Frontend ──► Cloudinary upload URL (direct)
```

## Feature → File Map

| Feature | Backend files | Frontend files |
|---------|---------------|----------------|
| Auth | userAuthenticate, userMiddleware, authService, tokenService, user model | authSlice, Login, Signup, App, axiosClient |
| Password Reset | userAuthenticate, emailService | ForgotPassword, ResetPassword, ChangePassword |
| Problems CRUD | problemsControllers, getNextProblemNo, problem model | AdminPanel, AdminUpdate, AdminDelete |
| Problem List | listingProblems, buildProblemQuery | Homepage, ProblemListSkeleton |
| Solve / Execute | userSubmission, executionService, judge0Service, encodeBase64 | ProblemPage, CodeEditorPanel, useRateLimit |
| Rate Limiting | rateLimitMiddleware, redis | useRateLimit, axiosClient |
| Videos | videoSection, attachVideoDetails, solutionVideo | Editorial, AdminUpload, AdminVideo |

## Tight Coupling / Risk Areas

1. **Judge0 payload encoding** — `judge0Service` relies on custom base64 utilities.
2. **Dual JWT cookies** — frontend must use `withCredentials`; backend CORS must whitelist Vite origin(s).
3. **Axios interceptor** — `axiosClient.js` contains silent retry logic for 401 and parsing of `retryAfterSeconds` from 429 errors.
4. **Language IDs** — duplicated concept in `constants/judge0.js` and frontend language dropdown keys.
5. **Rate limit headers** — frontend `useRateLimit` assumes error payload matches exact format from `rateLimitMiddleware.js`.
6. **Mongoose Models** — references rely on exact string capitalization (`"user"`, `"Problem"`, `"submission"`).

## Maintenance: File → Doc Path Convention

| Source path | Documentation path |
|-------------|-------------------|
| `backend/src/<layer>/<file>.js` | `backend_docs/<layer>/<file>.md` |
| `frontend/src/<area>/<file>.jsx` | `frontend_docs/<area>/<file>.md` |
| `frontend/src/authSlice.js` | `frontend_docs/state/authSlice.md` |
