# Documentation Index

**Hub for CodeArena (`coding-platform/`)**  
**Start here:** [recommended_visit.md](./recommended_visit.md) (entry points & first-read path) · [GETTING_STARTED.md](./GETTING_STARTED.md) (run locally)  
**Last reviewed:** 2026-05-29

---

## Recommended visit

| Document | Description |
|----------|-------------|
| [recommended_visit.md](./recommended_visit.md) | **Entry points, onboarding order, critical files, feature starts** |

---

## Architecture & Flows

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System overview, stack, feature boundaries, risks |
| [API_FLOW.md](./API_FLOW.md) | All HTTP endpoints, E2E sequences, external APIs |
| [AUTH_FLOW.md](./AUTH_FLOW.md) | Dual JWT cookies, refresh rotation, Redis, rate limits |
| [FRONTEND_FLOW.md](./FRONTEND_FLOW.md) | React bootstrap, routes, interceptors, state patterns |
| [BACKEND_FLOW.md](./BACKEND_FLOW.md) | Express layers, rate limiters, services, Judge0 |
| [DATABASE_FLOW.md](./DATABASE_FLOW.md) | Mongoose models, counters, query builders, Redis KV |
| [DEPENDENCY_GRAPH.md](./DEPENDENCY_GRAPH.md) | Import/coupling maps, tight coupling risks |
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Install, env vars, run, onboarding path |

## Maintenance

| Document | Description |
|----------|-------------|
| [DOCS_GUIDELINES.md](./DOCS_GUIDELINES.md) | How to write and place docs |
| [DOC_UPDATE_CHECKLIST.md](./DOC_UPDATE_CHECKLIST.md) | PR documentation checklist |
| [DOC_CHANGE_MAP.md](./DOC_CHANGE_MAP.md) | Source file → doc file mapping |

---

## Onboarding Path (New Developers)

See **[recommended_visit.md](./recommended_visit.md)** for the full curated path, entry-point table, and critical-files list.

---

## Frontend Documentation

### Pages

- [main.md](../frontend_docs/pages/main.md)
- [App.md](../frontend_docs/pages/App.md)
- [Login.md](../frontend_docs/pages/Login.md)
- [Signup.md](../frontend_docs/pages/Signup.md)
- [ForgotPassword.md](../frontend_docs/pages/ForgotPassword.md)
- [ResetPassword.md](../frontend_docs/pages/ResetPassword.md)
- [ChangePassword.md](../frontend_docs/pages/ChangePassword.md)
- [CheckEmail.md](../frontend_docs/pages/CheckEmail.md)
- [VerifyEmail.md](../frontend_docs/pages/VerifyEmail.md)
- [ResendVerification.md](../frontend_docs/pages/ResendVerification.md)
- [Profile.md](../frontend_docs/pages/Profile.md)
- [EditProfile.md](../frontend_docs/pages/EditProfile.md)
- [Homepage.md](../frontend_docs/pages/Homepage.md)
- [LandingPage.md](../frontend_docs/pages/LandingPage.md)
- [ProblemPage.md](../frontend_docs/pages/ProblemPage.md)
- [ProblemPage.css.md](../frontend_docs/pages/ProblemPage.css.md)
- [Admin.md](../frontend_docs/pages/Admin.md)

### Components

- [CreateProblem.md](../frontend_docs/components/admin/CreateProblem.md)
- [UpdateProblem.md](../frontend_docs/components/admin/UpdateProblem.md)
- [UpdateProblemList.md](../frontend_docs/components/admin/UpdateProblemList.md)
- [DeleteProblem.md](../frontend_docs/components/admin/DeleteProblem.md)
- [ManageVideoSolutions.md](../frontend_docs/components/admin/ManageVideoSolutions.md)
- [UploadVideoSolution.md](../frontend_docs/components/admin/UploadVideoSolution.md)
- [AdminFormComponents.md](../frontend_docs/components/admin/forms/AdminFormComponents.md)
- [SubmissionHistory.md](../frontend_docs/components/SubmissionHistory.md)
- [Editorial.md](../frontend_docs/components/Editorial.md)
- [HomeComponents.md](../frontend_docs/components/home/HomeComponents.md)
- [LandingComponents.md](../frontend_docs/components/landing/LandingComponents.md)
- [Skeletons.md](../frontend_docs/components/skeletons/Skeletons.md)

### Problem workspace (`components/problem/`)

- [CodeEditorPanel.md](../frontend_docs/components/problem/CodeEditorPanel.md)
- [LanguageSelector.md](../frontend_docs/components/problem/LanguageSelector.md)
- [LoadingScreen.md](../frontend_docs/components/problem/LoadingScreen.md)
- [ProblemDescription.md](../frontend_docs/components/problem/ProblemDescription.md)
- [ProblemTabs.md](../frontend_docs/components/problem/ProblemTabs.md)
- [ResultPanel.md](../frontend_docs/components/problem/ResultPanel.md)
- [TestCasePanel.md](../frontend_docs/components/problem/TestCasePanel.md)

### State, services, hooks & utils

- [authSlice.md](../frontend_docs/state/authSlice.md)
- [store.md](../frontend_docs/state/store.md)
- [axiosClient.md](../frontend_docs/services/axiosClient.md)
- [statsService.md](../frontend_docs/services/statsService.md)
- [useRateLimit.md](../frontend_docs/hooks/useRateLimit.md)
- [useDebounce.md](../frontend_docs/hooks/useDebounce.md)
- [constants.md](../frontend_docs/constants/constants.md)
- [errorHandler.md](../frontend_docs/utils/errorHandler.md)

---

## Backend Documentation

### Config & entry

- [index.md](../backend_docs/config/index.md)
- [db.md](../backend_docs/config/db.md)
- [redis.md](../backend_docs/config/redis.md)
- [r2Client.md](../backend_docs/config/r2Client.md)
- [judge0Client.md](../backend_docs/config/judge0Client.md)

### Routes

- [authRoutes.md](../backend_docs/routes/auth/authRoutes.md)
- [problemRoutes.md](../backend_docs/routes/problem/problemRoutes.md)
- [submissionRoutes.md](../backend_docs/routes/submission/submissionRoutes.md)
- [videoRoutes.md](../backend_docs/routes/video/videoRoutes.md)
- [profileRoutes.md](../backend_docs/routes/profile/profileRoutes.md)
- [statsRoutes.md](../backend_docs/routes/statsRoutes.md)

### Controllers

- [authController.md](../backend_docs/controllers/auth/authController.md)
- [problemController.md](../backend_docs/controllers/problem/problemController.md)
- [submissionController.md](../backend_docs/controllers/submission/submissionController.md)
- [videoController.md](../backend_docs/controllers/video/videoController.md)
- [profileController.md](../backend_docs/controllers/profile/profileController.md)
- [statsController.md](../backend_docs/controllers/statsController.md)

### Middleware

- [rateLimitMiddleware.md](../backend_docs/middlewares/rateLimitMiddleware.md)
- [authMiddleware.md](../backend_docs/middlewares/auth/authMiddleware.md)
- [adminMiddleware.md](../backend_docs/middlewares/auth/adminMiddleware.md)
- [errorMiddleware.md](../backend_docs/middlewares/errorMiddleware.md)
- [uploadZipMiddleware.md](../backend_docs/middlewares/uploadZipMiddleware.md)

### Database models & seed

- [user.md](../backend_docs/models/user.md)
- [problem.md](../backend_docs/models/problem.md)
- [submission.md](../backend_docs/models/submission.md)
- [solutionVideo.md](../backend_docs/models/solutionVideo.md)
- [problemNumbering.md](../backend_docs/models/problemNumbering.md)

### Services

- [authService.md](../backend_docs/services/auth/authService.md)
- [tokenService.md](../backend_docs/services/auth/tokenService.md)
- [refreshSessionService.md](../backend_docs/services/auth/refreshSessionService.md)
- [emailService.md](../backend_docs/services/auth/emailService.md)
- [executionService.md](../backend_docs/services/execution/executionService.md)
- [judge0Service.md](../backend_docs/services/execution/judge0Service.md)
- [listProblems.md](../backend_docs/services/problem/listProblems.md)
- [validateReferenceSolutions.md](../backend_docs/services/problem/validateReferenceSolutions.md)
- [attachVideoDetails.md](../backend_docs/services/problem/attachVideoDetails.md)
- [profileService.md](../backend_docs/services/profile/profileService.md)
- [storageServices.md](../backend_docs/services/storage/storageServices.md)
- [unverifiedUserCleanup.md](../backend_docs/services/jobs/unverifiedUserCleanup.md)

### Utils & constants

- [authUtils.md](../backend_docs/utils/auth/authUtils.md)
- [encodeBase64.md](../backend_docs/utils/judge/encodeBase64.md)
- [decodeBase64.md](../backend_docs/utils/judge/decodeBase64.md)
- [judge0Utils.md](../backend_docs/utils/judge/judge0Utils.md)
- [judgeUtils.md](../backend_docs/utils/judge/judgeUtils.md)
- [getExecutionLimits.md](../backend_docs/utils/judge/getExecutionLimits.md)
- [problemQueryUtils.md](../backend_docs/utils/problem/problemQueryUtils.md)
- [slugify.md](../backend_docs/utils/problem/slugify.md)
- [validateUserRegistration.md](../backend_docs/utils/validation/validateUserRegistration.md)
- [validationUtils.md](../backend_docs/utils/validation/validationUtils.md)
- [asyncHandler.md](../backend_docs/utils/asyncHandler.md)
- [ApiError.md](../backend_docs/utils/ApiError.md)
- [judge0.md](../backend_docs/constants/judge0.md)
- [judgeStatus.md](../backend_docs/constants/judgeStatus.md)
- [storage.md](../backend_docs/constants/storage.md)
- [rateLimitConstants.md](../backend_docs/constants/rateLimitConstants.md)

---

## Feature Quick Links

| Feature | Start reading |
|---------|----------------|
| Sign up / login | [Login.md](../frontend_docs/pages/Login.md), [AUTH_FLOW.md](./AUTH_FLOW.md) |
| Password reset | [ForgotPassword.md](../frontend_docs/pages/ForgotPassword.md), [AUTH_FLOW.md](./AUTH_FLOW.md) |
| Problem list | [Homepage.md](../frontend_docs/pages/Homepage.md), [listProblems.md](../backend_docs/services/problem/listProblems.md) |
| Code editor & execute | [ProblemPage.md](../frontend_docs/pages/ProblemPage.md), [executionService.md](../backend_docs/services/execution/executionService.md) |
| Admin CRUD | [CreateProblem.md](../frontend_docs/components/admin/CreateProblem.md), [problemController.md](../backend_docs/controllers/problem/problemController.md) |
| Editorial video | [Editorial.md](../frontend_docs/components/Editorial.md), [videoController.md](../backend_docs/controllers/video/videoController.md) |
| Rate Limits | [rateLimitMiddleware.md](../backend_docs/middlewares/rateLimitMiddleware.md), [useRateLimit.md](../frontend_docs/hooks/useRateLimit.md) |

---

## Repository Map (High Level)

```
CodeArena/
└── coding-platform/
    ├── backend/src/     → API, models, services, Judge0
    ├── frontend/src/    → React UI, axiosClient, Redux
    ├── docs/            → Architecture & hub (you are here)
    ├── frontend_docs/   → Per-file frontend docs
    └── backend_docs/    → Per-file backend docs
```
