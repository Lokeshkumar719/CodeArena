# Dependency Graph

**Last reviewed:** 2026-05-18

## Backend Import Graph (simplified)

```
index.js
├── config/db.js
├── config/redis.js
├── routes/userAuth.js → controllers/userAuthenticate.js
│                      → middlewares/userMiddleware.js
│                      → middlewares/adminMiddleware.js
├── routes/problemCreator.js → controllers/problemsControllers.js
│                             → middlewares/*
├── routes/submit.js → controllers/userSubmission.js
├── routes/videoCreator.js → controllers/videoSection.js
└── middlewares/errorMiddleware.js

controllers/* → models/*, services/judge0Service.js, utils/*
services/judge0Service.js → config/judge0Client.js, constants/judge0.js
utils/problemUtility.js → constants/judge0.js
middlewares/* → models/user.js, config/redis.js, utils/asyncHandler.js
```

## Frontend Import Graph (simplified)

```
main.jsx → App.jsx, store/store.js
store/store.js → authSlice.js → utils/axiosClient.js

App.jsx → pages/*, components/Admin*

Homepage.jsx → axiosClient, authSlice (logout)

ProblemPage.jsx → axiosClient, components/problem/*, SubmissionHistory, Editorial

Admin*.jsx → axiosClient, react-hook-form, zod

authSlice.js → @reduxjs/toolkit, axiosClient
```

## Cross-Stack Coupling

| Frontend module | Backend endpoint(s) |
|-----------------|---------------------|
| `authSlice` | `/user/register`, `/login`, `/logout`, `/check` |
| `Homepage` | `/problem/getAllProblems`, `/problemSolvedByUser` |
| `ProblemPage` | `/problem/problemById/:id`, `/submission/run`, `/submission/submit` |
| `SubmissionHistory` | `/problem/problemSubmmision/:id` |
| `AdminPanel` | `/problem/create` |
| `AdminUpdate` | `/problem/admin/problemById/:id`, `/problem/update/:id` |
| `AdminDelete` | `/problem/getAllProblems`, `/problem/delete/:id` |
| `AdminUpload` | `/video/create/:id`, Cloudinary, `/video/save` |

## External Runtime Dependencies

```
Backend ──► MongoDB (DB_CONNECT_STRING)
Backend ──► Redis (REDIS_URL)
Backend ──► Judge0 RapidAPI (RAPID_API_KEY)
Backend ──► Cloudinary API
Frontend ──► Backend HTTP API (localhost:3000)
Frontend ──► Cloudinary upload URL (direct)
```

## Feature → File Map

| Feature | Backend files | Frontend files |
|---------|---------------|----------------|
| Auth | userAuthenticate, userMiddleware, user model | authSlice, Login, Signup, App |
| Problems CRUD | problemsControllers, problems model | AdminPanel, AdminUpdate, AdminDelete |
| Solve | userSubmission, judge0Service | ProblemPage, CodeEditorPanel, panels |
| Videos | videoSection, solutionVideo | Editorial, AdminUpload, AdminVideo |

## Tight Coupling / Risk Areas

1. **Judge0** — all run/submit/create/update paths depend on external API availability and polling logic.
2. **Cookie auth** — frontend must use `withCredentials`; backend CORS origin must match Vite port.
3. **Language IDs** — duplicated concept in `constants/judge0.js`; frontend hardcodes `javascript|java|cpp` in multiple files.
4. **Tag enums** — duplicated between `problems.js` schema and frontend `tagOptions` arrays.
5. **userMiddleware bug** — breaks entire authenticated surface if file content is wrong.

## Maintenance: File → Doc Path Convention

| Source path | Documentation path |
|-------------|-------------------|
| `backend/src/<layer>/<file>.js` | `backend_docs/<layer>/<file>.md` |
| `frontend/src/<area>/<file>.jsx` | `frontend_docs/<area>/<file>.md` |
| `frontend/src/authSlice.js` | `frontend_docs/state/authSlice.md` |

See [DOCS_GUIDELINES.md](./DOCS_GUIDELINES.md) and [DOC_UPDATE_CHECKLIST.md](./DOC_UPDATE_CHECKLIST.md).

## Automation Suggestions (Phase 6)

- Script: parse `routes/*.js` and generate API table diff for `API_FLOW.md`
- Script: grep `axiosClient.(get|post|put|delete)` in `frontend/src` to validate endpoint list
- CI check: fail if route added without matching doc in `backend_docs/routes/`
- Optional: `dependency-cruiser` or `madge` for import graphs
