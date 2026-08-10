# Recommended Visit

**Purpose:** Curated entry points and first-read path for new developers.  
**Project:** CodeArena (`coding-platform/`)  
**Last reviewed:** 2026-05-29

> Start the full doc system at [DOC_INDEX.md](./DOC_INDEX.md). Use this page when you want the **shortest path** into the codebase.

---

## Onboarding path (recommended order)

1. [GETTING_STARTED.md](./GETTING_STARTED.md) — install, env vars, run frontend + backend (Redis required)
2. [ARCHITECTURE.md](./ARCHITECTURE.md) — system mental model (10 min)  
3. [AUTH_FLOW.md](./AUTH_FLOW.md) + [API_FLOW.md](./API_FLOW.md) — cookies, routes, rate limiting, E2E calls  
4. **Solve flow (trace once):**  
   - [ProblemPage.md](../frontend_docs/pages/ProblemPage.md)  
   - → [submissionController.md](../backend_docs/controllers/submission/submissionController.md)  
   - → [executionService.md](../backend_docs/services/execution/executionService.md)
   - → [judge0Service.md](../backend_docs/services/execution/judge0Service.md)  
5. [DEPENDENCY_GRAPH.md](./DEPENDENCY_GRAPH.md) — coupling and risks  
6. [DOC_INDEX.md](./DOC_INDEX.md) — when you touch a specific file  

---

## Important entry points

| Layer | Source file | Documentation |
|-------|-------------|---------------|
| Frontend bootstrap | `frontend/src/main.jsx` | [main.md](../frontend_docs/pages/main.md) |
| Frontend routing & guards | `frontend/src/App.jsx` | [App.md](../frontend_docs/pages/App.md) |
| Auth state (Redux) | `frontend/src/authSlice.js` | [authSlice.md](../frontend_docs/state/authSlice.md) |
| Rate Limit UI Hook | `frontend/src/hooks/useRateLimit.jsx` | [useRateLimit.md](../frontend_docs/hooks/useRateLimit.md) |
| HTTP client (Interceptors) | `frontend/src/utils/axiosClient.js` | [axiosClient.md](../frontend_docs/services/axiosClient.md) |
| Backend server entry | `backend/src/index.js` | [index.md](../backend_docs/config/index.md) |
| Rate limit middleware | `backend/src/middlewares/rateLimitMiddleware.js` | [rateLimitMiddleware.md](../backend_docs/middlewares/rateLimitMiddleware.md) |
| Redis config & client | `backend/src/config/redis.js` | [redis.md](../backend_docs/config/redis.md) |
| Auth services (Refresh) | `backend/src/services/auth/` | [authService.md](../backend_docs/services/auth/authService.md) |
| Problem querying | `backend/src/services/problem/listProblems.js` | [listProblems.md](../backend_docs/services/problem/listProblems.md) |
| Run & submit logic | `backend/src/controllers/submission/submissionController.js` | [submissionController.md](../backend_docs/controllers/submission/submissionController.md) |
| User auth middleware | `backend/src/middlewares/auth/authMiddleware.js` | [authMiddleware.md](../backend_docs/middlewares/auth/authMiddleware.md) |
| Admin auth middleware | `backend/src/middlewares/auth/adminMiddleware.js` | [adminMiddleware.md](../backend_docs/middlewares/auth/adminMiddleware.md) |
| Global errors | `backend/src/middlewares/errorMiddleware.js` | [errorMiddleware.md](../backend_docs/middlewares/errorMiddleware.md) |
| Judge0 batch + base64 | `backend/src/services/execution/judge0Service.js` | [judge0Service.md](../backend_docs/services/execution/judge0Service.md) |

---

## Critical files to read first

Read in this order before diving into admin or video features:

| Priority | File | Why |
|----------|------|-----|
| 1 | `backend/src/index.js` | How routers, CORS, DB, Redis, and server start fit together |
| 2 | `backend/src/middlewares/auth/authMiddleware.js` | Auth gate for almost all user APIs — dual JWT logic |
| 3 | `backend/src/middlewares/rateLimitMiddleware.js` | Protects endpoints from abuse, uses Lua for Token Buckets |
| 4 | `frontend/src/utils/axiosClient.js` | Silent token refresh logic and 429 rate limit parsing |
| 5 | `backend/src/services/auth/refreshSessionService.js` | Core token rotation and session management |
| 6 | `frontend/src/App.jsx` | Client routes and auth guards |
| 7 | `frontend/src/pages/ProblemPage.jsx` | Core product: editor, run, submit |
| 8 | `backend/src/services/execution/executionService.js` | Orchestrates code execution, limits, and result saving |

---

## Feature entry points (where to start per area)

| Feature | Frontend start | Backend start | Flow doc |
|---------|----------------|---------------|----------|
| Sign up / login | [Login.md](../frontend_docs/pages/Login.md) | [authController.md](../backend_docs/controllers/auth/authController.md) | [AUTH_FLOW.md](./AUTH_FLOW.md) |
| Password reset | [ForgotPassword.md](../frontend_docs/pages/ForgotPassword.md) | `forgotPassword` in authController | [AUTH_FLOW.md](./AUTH_FLOW.md) |
| Problem list/search | [Homepage.md](../frontend_docs/pages/Homepage.md) | [listProblems.md](../backend_docs/services/problem/listProblems.md) | [API_FLOW.md](./API_FLOW.md) |
| Solve problem | [ProblemPage.md](../frontend_docs/pages/ProblemPage.md) | [submissionController.md](../backend_docs/controllers/submission/submissionController.md) | [FRONTEND_FLOW.md](./FRONTEND_FLOW.md) |
| Admin create problem | [CreateProblem.md](../frontend_docs/components/admin/CreateProblem.md) | `createProblem` | [API_FLOW.md](./API_FLOW.md) |

---

## Repository map (high level)

```
CodeArena/
└── coding-platform/
    ├── backend/src/       # Express API (default 3000)
    ├── frontend/src/      # Vite + React (default 5173)
    ├── docs/              # Architecture + this file
    ├── frontend_docs/     # Per-file frontend documentation
    └── backend_docs/      # Per-file backend documentation
```

**Stack (short):** React 19 + Vite + Redux (auth only) | Express + Mongoose + Redis + Judge0 + Cloudflare R2 + Resend
**Realtime:** None (no WebSocket)

---

## Runtime entry points (how to run)

| App | Command | Default URL |
|-----|---------|-------------|
| Backend | `cd backend && npm run dev` | `http://localhost:3000` |
| Frontend | `cd frontend && npm run dev` | `http://localhost:5173` |

Env template and prerequisites: [GETTING_STARTED.md](./GETTING_STARTED.md)

---

## Known risks (read early)

| Risk | Where to read more |
|------|-------------------|
| Rate limiters fail open if Redis crashes | [rateLimitMiddleware.md](../backend_docs/middlewares/rateLimitMiddleware.md) |
| Dual JWT logic: access token expires in 15m | [AUTH_FLOW.md](./AUTH_FLOW.md) |
| Judge0 requires base64 encoded payloads | [judge0Service.md](../backend_docs/services/execution/judge0Service.md) |
| MongoDB text index required on Problem `title` | [DATABASE_FLOW.md](./DATABASE_FLOW.md) |
| `isSolved` flag requires heavy submission lookups | [listProblems.md](../backend_docs/services/problem/listProblems.md) |

---

## Related architecture docs

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [API_FLOW.md](./API_FLOW.md)
- [AUTH_FLOW.md](./AUTH_FLOW.md)
- [FRONTEND_FLOW.md](./FRONTEND_FLOW.md)
- [BACKEND_FLOW.md](./BACKEND_FLOW.md)
- [DATABASE_FLOW.md](./DATABASE_FLOW.md)
- [DEPENDENCY_GRAPH.md](./DEPENDENCY_GRAPH.md)
- [DOC_INDEX.md](./DOC_INDEX.md) — full file index
