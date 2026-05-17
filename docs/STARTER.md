# Recommended Visit

**Purpose:** Curated entry points and first-read path for new developers.  
**Project:** CodeArena (`coding-platform/`)  
**Last reviewed:** 2026-05-18

> Start the full doc system at [DOC_INDEX.md](./DOC_INDEX.md). Use this page when you want the **shortest path** into the codebase.

---

## Onboarding path (recommended order)

1. [GETTING_STARTED.md](./GETTING_STARTED.md) — install, env vars, run frontend + backend  
2. [ARCHITECTURE.md](./ARCHITECTURE.md) — system mental model (10 min)  
3. [AUTH_FLOW.md](./AUTH_FLOW.md) + [API_FLOW.md](./API_FLOW.md) — cookies, routes, E2E calls  
4. **Solve flow (trace once):**  
   - [ProblemPage.md](../frontend_docs/pages/ProblemPage.md)  
   - → [userSubmission.md](../backend_docs/controllers/userSubmission.md)  
   - → [judge0Service.md](../backend_docs/services/judge0Service.md)  
5. [DEPENDENCY_GRAPH.md](./DEPENDENCY_GRAPH.md) — coupling and risks  
6. [DOC_INDEX.md](./DOC_INDEX.md) — when you touch a specific file  

---

## Important entry points

| Layer | Source file | Documentation |
|-------|-------------|---------------|
| Frontend bootstrap | `frontend/src/main.jsx` | [main.md](../frontend_docs/pages/main.md) |
| Frontend routing & guards | `frontend/src/App.jsx` | [App.md](../frontend_docs/pages/App.md) |
| Auth state (Redux) | `frontend/src/authSlice.js` | [authSlice.md](../frontend_docs/state/authSlice.md) |
| Redux store | `frontend/src/store/store.js` | [store.md](../frontend_docs/state/store.md) |
| HTTP client (all API calls) | `frontend/src/utils/axiosClient.js` | [axiosClient.md](../frontend_docs/services/axiosClient.md) |
| Backend server entry | `backend/src/index.js` | [index.md](../backend_docs/config/index.md) |
| MongoDB connection | `backend/src/config/db.js` | [db.md](../backend_docs/config/db.md) |
| Redis (logout blocklist) | `backend/src/config/redis.js` | [redis.md](../backend_docs/config/redis.md) |
| Judge0 HTTP client | `backend/src/config/judge0Client.js` | [judge0Client.md](../backend_docs/config/judge0Client.md) |
| Auth routes | `backend/src/routes/userAuth.js` | [userAuth.md](../backend_docs/routes/userAuth.md) |
| Problem routes | `backend/src/routes/problemCreator.js` | [problemCreator.md](../backend_docs/routes/problemCreator.md) |
| Submit / run routes | `backend/src/routes/submit.js` | [submit.md](../backend_docs/routes/submit.md) |
| Video routes | `backend/src/routes/videoCreator.js` | [videoCreator.md](../backend_docs/routes/videoCreator.md) |
| Auth controller | `backend/src/controllers/userAuthenticate.js` | [userAuthenticate.md](../backend_docs/auth/userAuthenticate.md) |
| Run & submit logic | `backend/src/controllers/userSubmission.js` | [userSubmission.md](../backend_docs/controllers/userSubmission.md) |
| Problem CRUD | `backend/src/controllers/problemsControllers.js` | [problemsControllers.md](../backend_docs/controllers/problemsControllers.md) |
| Cloudinary videos | `backend/src/controllers/videoSection.js` | [videoSection.md](../backend_docs/controllers/videoSection.md) |
| User auth middleware ⚠ | `backend/src/middlewares/userMiddleware.js` | [userMiddleware.md](../backend_docs/middleware/userMiddleware.md) |
| Admin auth middleware | `backend/src/middlewares/adminMiddleware.js` | [adminMiddleware.md](../backend_docs/middleware/adminMiddleware.md) |
| Global errors | `backend/src/middlewares/errorMiddleware.js` | [errorMiddleware.md](../backend_docs/middleware/errorMiddleware.md) |
| Judge0 batch + poll | `backend/src/services/judge0Service.js` | [judge0Service.md](../backend_docs/services/judge0Service.md) |

---

## Critical files to read first

Read in this order before diving into admin or video features:

| Priority | File | Why |
|----------|------|-----|
| 1 | `backend/src/index.js` | How routers, CORS, DB, Redis, and server start fit together |
| 2 | `backend/src/middlewares/userMiddleware.js` | ⚠ Auth gate for almost all user APIs — verify role logic |
| 3 | `backend/src/controllers/userAuthenticate.js` | Register, login, logout, JWT cookie |
| 4 | `frontend/src/App.jsx` | Client routes and auth guards |
| 5 | `frontend/src/authSlice.js` | Session bootstrap and login state |
| 6 | `frontend/src/pages/ProblemPage.jsx` | Core product: editor, run, submit |
| 7 | `backend/src/controllers/userSubmission.js` | Judge0 run/submit + submission persistence |

---

## Feature entry points (where to start per area)

| Feature | Frontend start | Backend start | Flow doc |
|---------|----------------|---------------|----------|
| Sign up / login | [Login.md](../frontend_docs/pages/Login.md), [Signup.md](../frontend_docs/pages/Signup.md) | [userAuthenticate.md](../backend_docs/auth/userAuthenticate.md) | [AUTH_FLOW.md](./AUTH_FLOW.md) |
| Problem list | [Homepage.md](../frontend_docs/pages/Homepage.md) | [problemsControllers.md](../backend_docs/controllers/problemsControllers.md) | [API_FLOW.md](./API_FLOW.md) |
| Solve problem | [ProblemPage.md](../frontend_docs/pages/ProblemPage.md) | [userSubmission.md](../backend_docs/controllers/userSubmission.md) | [FRONTEND_FLOW.md](./FRONTEND_FLOW.md) |
| Submission history | [SubmissionHistory.md](../frontend_docs/components/SubmissionHistory.md) | `submittedProblem` in problemsControllers | [API_FLOW.md](./API_FLOW.md) |
| Admin dashboard | [Admin.md](../frontend_docs/pages/Admin.md) | [problemCreator.md](../backend_docs/routes/problemCreator.md) | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Admin create problem | [AdminPanel.md](../frontend_docs/components/AdminPanel.md) | `createProblem` | [API_FLOW.md](./API_FLOW.md) |
| Editorial video | [Editorial.md](../frontend_docs/components/Editorial.md), [AdminUpload.md](../frontend_docs/components/AdminUpload.md) | [videoSection.md](../backend_docs/controllers/videoSection.md) | [API_FLOW.md](./API_FLOW.md) |

---

## Repository map (high level)

```
LeetLab/
└── coding-platform/
    ├── backend/src/       # Express API (port from .env, typically 3000)
    ├── frontend/src/      # Vite + React (default 5173)
    ├── docs/              # Architecture + this file
    ├── frontend_docs/     # Per-file frontend documentation
    └── backend_docs/      # Per-file backend documentation
```

**Stack (short):** React 19 + Vite + Redux (auth only) | Express + Mongoose + Redis + Judge0 + Cloudinary  
**Realtime:** None (no WebSocket) — see [websocket/README.md](../backend_docs/websocket/README.md)

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
| `userMiddleware` may require admin role on user routes | [userMiddleware.md](../backend_docs/middleware/userMiddleware.md), [AUTH_FLOW.md](./AUTH_FLOW.md) |
| `/problem/:id` not gated in UI but API needs cookie | [App.md](../frontend_docs/pages/App.md) |
| Judge0 external dependency | [judge0Service.md](../backend_docs/services/judge0Service.md) |
| Hardcoded API URL / CORS origin | [axiosClient.md](../frontend_docs/services/axiosClient.md), [index.md](../backend_docs/config/index.md) |

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






#### demo commit
#### demo commit 2