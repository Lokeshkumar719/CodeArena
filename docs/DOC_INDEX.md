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
- [Homepage.md](../frontend_docs/pages/Homepage.md)
- [ProblemPage.md](../frontend_docs/pages/ProblemPage.md)
- [ProblemPage.css.md](../frontend_docs/pages/ProblemPage.css.md)
- [Admin.md](../frontend_docs/pages/Admin.md)

### Components

- [AdminPanel.md](../frontend_docs/components/AdminPanel.md)
- [AdminUpdate.md](../frontend_docs/components/AdminUpdate.md)
- [AdminUpdateList.md](../frontend_docs/components/AdminUpdateList.md)
- [AdminDelete.md](../frontend_docs/components/AdminDelete.md)
- [AdminVideo.md](../frontend_docs/components/AdminVideo.md)
- [AdminUpload.md](../frontend_docs/components/AdminUpload.md)
- [SubmissionHistory.md](../frontend_docs/components/SubmissionHistory.md)
- [Editorial.md](../frontend_docs/components/Editorial.md)

### Problem workspace (`components/problem/`)

- [ActionBar.md](../frontend_docs/components/problem/ActionBar.md)
- [CodeEditorPanel.md](../frontend_docs/components/problem/CodeEditorPanel.md)
- [LanguageSelector.md](../frontend_docs/components/problem/LanguageSelector.md)
- [LoadingScreen.md](../frontend_docs/components/problem/LoadingScreen.md)
- [ProblemDescription.md](../frontend_docs/components/problem/ProblemDescription.md)
- [ProblemTabs.md](../frontend_docs/components/problem/ProblemTabs.md)
- [ResultPanel.md](../frontend_docs/components/problem/ResultPanel.md)
- [TestCasePanel.md](../frontend_docs/components/problem/TestCasePanel.md)

### State, services & hooks

- [authSlice.md](../frontend_docs/state/authSlice.md)
- [store.md](../frontend_docs/state/store.md)
- [axiosClient.md](../frontend_docs/services/axiosClient.md)
- [useRateLimit.md](../frontend_docs/hooks/useRateLimit.md)

---

## Backend Documentation

### Config & entry

- [index.md](../backend_docs/config/index.md)
- [db.md](../backend_docs/config/db.md)
- [redis.md](../backend_docs/config/redis.md)
- [judge0Client.md](../backend_docs/config/judge0Client.md)

### Routes

- [userAuth.md](../backend_docs/routes/userAuth.md)
- [problemCreator.md](../backend_docs/routes/problemCreator.md)
- [submit.md](../backend_docs/routes/submit.md)
- [videoCreator.md](../backend_docs/routes/videoCreator.md)

### Controllers

- [userAuthenticate.md](../backend_docs/auth/userAuthenticate.md)
- [problemsControllers.md](../backend_docs/controllers/problemsControllers.md)
- [userSubmission.md](../backend_docs/controllers/userSubmission.md)
- [videoSection.md](../backend_docs/controllers/videoSection.md)

### Middleware

- [rateLimitMiddleware.md](../backend_docs/middleware/rateLimitMiddleware.md)
- [userMiddleware.md](../backend_docs/middleware/userMiddleware.md)
- [adminMiddleware.md](../backend_docs/middleware/adminMiddleware.md)
- [errorMiddleware.md](../backend_docs/middleware/errorMiddleware.md)

### Database models & seed

- [user.md](../backend_docs/database/user.md)
- [problems.md](../backend_docs/database/problems.md)
- [submission.md](../backend_docs/database/submission.md)
- [solutionVideo.md](../backend_docs/database/solutionVideo.md)
- [problemNumbering.md](../backend_docs/database/problemNumbering.md)

### Services

- [authService.md](../backend_docs/services/authService.md)
- [refreshSessionService.md](../backend_docs/services/refreshSessionService.md)
- [executionService.md](../backend_docs/services/executionService.md)
- [judge0Service.md](../backend_docs/services/judge0Service.md)
- [listingProblems.md](../backend_docs/services/listingProblems.md)

### Utils & constants

- [buildProblemQuery.md](../backend_docs/utils/buildProblemQuery.md)
- [getNextProblemNo.md](../backend_docs/utils/getNextProblemNo.md)
- [encodeBase64.md](../backend_docs/utils/encodeBase64.md)
- [decodeBase64.md](../backend_docs/utils/decodeBase64.md)
- [validate.md](../backend_docs/utils/validate.md)
- [asyncHandler.md](../backend_docs/utils/asyncHandler.md)
- [judge0.md](../backend_docs/constants/judge0.md)
- [judgeStatus.md](../backend_docs/constants/judgeStatus.md)

---

## Feature Quick Links

| Feature | Start reading |
|---------|----------------|
| Sign up / login | [Login.md](../frontend_docs/pages/Login.md), [AUTH_FLOW.md](./AUTH_FLOW.md) |
| Password reset | [ForgotPassword.md](../frontend_docs/pages/ForgotPassword.md), [AUTH_FLOW.md](./AUTH_FLOW.md) |
| Problem list | [Homepage.md](../frontend_docs/pages/Homepage.md), [listingProblems.md](../backend_docs/services/listingProblems.md) |
| Code editor & execute | [ProblemPage.md](../frontend_docs/pages/ProblemPage.md), [executionService.md](../backend_docs/services/executionService.md) |
| Admin CRUD | [AdminPanel.md](../frontend_docs/components/AdminPanel.md), [problemsControllers.md](../backend_docs/controllers/problemsControllers.md) |
| Editorial video | [Editorial.md](../frontend_docs/components/Editorial.md), [videoSection.md](../backend_docs/controllers/videoSection.md) |
| Rate Limits | [rateLimitMiddleware.md](../backend_docs/middleware/rateLimitMiddleware.md), [useRateLimit.md](../frontend_docs/hooks/useRateLimit.md) |

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
