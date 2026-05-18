# System Architecture

**Project:** CodeArena / LeetLab coding platform  
**Repository layout:** `coding-platform/` (monorepo-style split: `frontend/` + `backend/`)  
**Last reviewed:** 2026-05-18

## Overview

CodeArena is a LeetCode-style web application where users register, browse DSA problems, write code in a Monaco editor, run against visible test cases, submit against hidden test cases (via Judge0), and track solved problems. Admins create/update/delete problems and upload editorial videos to Cloudinary.

There is **no WebSocket or realtime layer** in the current codebase (verified by search).

## High-Level Diagram

```mermaid
flowchart TB
  subgraph Client["Frontend (Vite + React 19)"]
    UI[Pages & Components]
    Redux[Redux Toolkit - auth slice]
    Axios[axiosClient withCredentials]
    UI --> Redux
    UI --> Axios
  end

  subgraph Server["Backend (Express 4)"]
    Routes[Routes: /user /problem /submission /video]
  MW[Middleware: JWT cookie + Redis blocklist]
    Ctrl[Controllers]
    Svc[judge0Service]
    Routes --> MW --> Ctrl
    Ctrl --> Svc
  end

  subgraph External["External Services"]
    MongoDB[(MongoDB via Mongoose)]
    Redis[(Redis)]
    J0[Judge0 CE via RapidAPI]
    Cloud[Cloudinary]
  end

  Axios -->|HTTP + httpOnly cookie| Routes
  Ctrl --> MongoDB
  MW --> Redis
  Svc --> J0
  Ctrl --> Cloud
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 8, React Router 7, Redux Toolkit, Tailwind + DaisyUI, Monaco Editor, react-hook-form + Zod |
| Backend | Node.js, Express, Mongoose 9, JWT (cookie), bcrypt, Redis 5 |
| Code execution | Judge0 CE (RapidAPI) |
| Media | Cloudinary (signed direct upload from browser) |
| Database | MongoDB |

## Feature Boundaries

| Feature | Frontend | Backend | Data |
|---------|----------|---------|------|
| Auth | `authSlice`, Login/Signup | `/user/*` | `user` collection, Redis token blocklist |
| Problem catalog | `Homepage` | `/problem/getAllProblems`, filters client-side | `Problem` |
| Problem solve | `ProblemPage` + problem components | `/problem/problemById`, `/submission/*` | `Problem`, `submission` |
| Submissions history | `SubmissionHistory` | `/problem/problemSubmmision/:id` | `submission` |
| Admin CRUD | Admin* components | `/problem/create|update|delete`, admin routes | `Problem` |
| Editorial video | `Editorial`, `AdminUpload` | `/video/*` + Cloudinary | `solutionVideo` |

## Configuration & Environment (uncertain values)

No `.env` files are committed. Backend expects (from code references):

- `PORT`, `DB_CONNECT_STRING`, `JWT_KEY`, `REDIS_URL`
- `RAPID_API_KEY` (Judge0)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

Frontend hardcodes API base URL: `http://localhost:3000` in `axiosClient.js`.  
CORS on backend allows `http://localhost:5173` only.

## Known Architectural Risks

1. **`userMiddleware.js` appears to export admin-only logic** (same as `adminMiddleware.js`). All “user” protected routes may incorrectly require `role === 'admin'`. See [AUTH_FLOW.md](./AUTH_FLOW.md) and [backend_docs/middleware/userMiddleware.md](../backend_docs/middleware/userMiddleware.md).
2. **Route vs UI auth mismatch:** `/problem/:problemId` is not gated in `App.jsx`, but APIs require authentication.
3. **Judge0 status field inconsistency:** `problemsControllers` uses `status_id`; `userSubmission` uses `status.id`.
4. **Unused dependencies:** `helmet`, `morgan`, `rate-limiter-flexible` listed in `package.json` but not wired in `index.js`.
5. **`submission` schema** has no `errorMessage` field; controller assigns it anyway (may be stripped by Mongoose strict mode).

## Related Documentation

- [API_FLOW.md](./API_FLOW.md)
- [AUTH_FLOW.md](./AUTH_FLOW.md)
- [FRONTEND_FLOW.md](./FRONTEND_FLOW.md)
- [BACKEND_FLOW.md](./BACKEND_FLOW.md)
- [DATABASE_FLOW.md](./DATABASE_FLOW.md)
- [DEPENDENCY_GRAPH.md](./DEPENDENCY_GRAPH.md)
- [GETTING_STARTED.md](./GETTING_STARTED.md)
- [DOC_INDEX.md](./DOC_INDEX.md)