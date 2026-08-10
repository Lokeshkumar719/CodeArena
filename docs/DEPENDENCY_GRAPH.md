# Dependency Graph

**Last reviewed:** 2026-05-29

## Backend Import Graph (simplified)

```
index.js
├── config/db.js
├── config/redis.js
├── config/r2Client.js
├── routes/auth/authRoutes.js → middlewares/rateLimitMiddleware.js
│                             → middlewares/userMiddleware.js
│                             → middlewares/adminMiddleware.js
│                             → controllers/auth/authController.js
├── routes/problem/problemRoutes.js → controllers/problem/problemController.js
├── routes/submission/submissionRoutes.js → controllers/submission/submissionController.js
├── routes/video/videoRoutes.js → controllers/video/videoController.js
├── routes/profile/profileRoutes.js → controllers/profile/profileController.js
├── routes/statsRoutes.js → controllers/statsController.js
└── middlewares/errorMiddleware.js

controllers/auth/authController.js → services/auth/*, utils/auth/*, models/user.js, config/redis.js
controllers/problem/problemController.js → services/problem/*, services/storageServices.js, models/problem.js, models/reusableProblemNo.js
controllers/submission/submissionController.js → services/executionService.js, utils/getExecutionLimits.js
controllers/video/videoController.js → models/solutionVideo.js

services/executionService.js → services/judge0Service.js, utils/getSubmissionResult.js
services/judge0Service.js → config/judge0Client.js, utils/decodeBase64.js, utils/encodeBase64.js

middlewares/rateLimitMiddleware.js → config/redis.js, rate-limiter-flexible
middlewares/userMiddleware.js → services/auth/tokenService.js, models/user.js
```

## Frontend Import Graph (simplified)

```
main.jsx → App.jsx, store/store.js
store/store.js → authSlice.js → utils/axiosClient.js

App.jsx → pages/*, components/admin/*, nprogress

pages/Homepage.jsx → axiosClient, authSlice, components/skeletons/ProblemListSkeleton
pages/ProblemPage.jsx → axiosClient, hooks/useRateLimit, components/problem/*, SubmissionHistory, Editorial

pages/ForgotPassword.jsx, pages/ResetPassword.jsx → axiosClient, react-hook-form, zod
pages/Login.jsx, pages/Signup.jsx → authSlice, react-hook-form, zod
pages/VerifyEmail.jsx, pages/CheckEmail.jsx → axiosClient
pages/Profile.jsx, pages/EditProfile.jsx → axiosClient

components/problem/CodeEditorPanel.jsx → @monaco-editor/react
components/Admin/*.jsx → axiosClient, react-hook-form, zod, components/skeletons/*
```

## Cross-Stack Coupling

| Frontend module | Backend endpoint(s) |
|-----------------|---------------------|
| `authSlice` | `/user/register`, `/user/login`, `/user/logout`, `/user/check` |
| `axiosClient` | `/user/refresh` (in interceptor) |
| `ForgotPassword` | `/user/forgot-password` |
| `ResetPassword` | `/user/reset-password/:token` |
| `ChangePassword`| `/user/change-password` |
| `VerifyEmail`   | `/user/verify-email/:token` |
| `Profile`       | `/profile/me`, `/profile/:username` |
| `Homepage` | `/problem/getProblems` |
| `ProblemPage` | `/problem/:slug`, `/submission/run/:id`, `/submission/submit/:id` |
| `SubmissionHistory` | `/problem/problemSubmmision/:id` |
| `CreateProblem` | `/problem/create` |
| `UpdateProblem` | `/problem/admin/problemById/:id`, `/problem/update/:id` |
| `DeleteProblem` | `/problem/delete/:id` |
| `UploadVideoSolution` | `/video/upload/:problemId` |
| `ManageVideoSolutions` | `/video/delete/:problemId`, `/video/update/:problemId` |

## External Runtime Dependencies

```
Backend ──► MongoDB (DB_CONNECT_STRING)
Backend ──► Redis (REDIS_URL)
Backend ──► Judge0 RapidAPI (RAPID_API_KEY)
Backend ──► Cloudflare R2 (R2_*)
Backend ──► Resend API (RESEND_API_KEY)
Frontend ──► Backend HTTP API (localhost:3000)
```

## Feature → File Map

| Feature | Backend files | Frontend files |
|---------|---------------|----------------|
| Auth | authController, userMiddleware, authService, tokenService, user model | authSlice, Login, Signup, App, axiosClient, VerifyEmail |
| Password Reset | authController, emailService | ForgotPassword, ResetPassword, ChangePassword |
| Profile & Stats | profileController, statsController | Profile, EditProfile |
| Problems CRUD | problemController, getNextProblemNo, problem model, storageServices | CreateProblem, UpdateProblem, DeleteProblem |
| Problem List | listingProblems, buildProblemQuery | Homepage, ProblemListSkeleton |
| Solve / Execute | submissionController, executionService, judge0Service, encodeBase64 | ProblemPage, CodeEditorPanel, useRateLimit |
| Rate Limiting | rateLimitMiddleware, redis | useRateLimit, axiosClient |
| Videos | videoController, attachVideoDetails, solutionVideo | Editorial, UploadVideoSolution, ManageVideoSolutions |

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
