# Change-Aware Documentation Map

**Purpose:** When you edit source code, find the exact doc file(s) to update.  
**Last reviewed:** 2026-05-18

## Source → Documentation Mapping

### Backend

| Source file | Documentation |
|-------------|---------------|
| `backend/src/index.js` | [backend_docs/config/index.md](../backend_docs/config/index.md) |
| `backend/src/config/db.js` | [backend_docs/config/db.md](../backend_docs/config/db.md) |
| `backend/src/config/redis.js` | [backend_docs/config/redis.md](../backend_docs/config/redis.md) |
| `backend/src/config/judge0Client.js` | [backend_docs/config/judge0Client.md](../backend_docs/config/judge0Client.md) |
| `backend/src/routes/userAuth.js` | [backend_docs/routes/userAuth.md](../backend_docs/routes/userAuth.md) |
| `backend/src/routes/problemCreator.js` | [backend_docs/routes/problemCreator.md](../backend_docs/routes/problemCreator.md) |
| `backend/src/routes/submit.js` | [backend_docs/routes/submit.md](../backend_docs/routes/submit.md) |
| `backend/src/routes/videoCreator.js` | [backend_docs/routes/videoCreator.md](../backend_docs/routes/videoCreator.md) |
| `backend/src/controllers/userAuthenticate.js` | [backend_docs/auth/userAuthenticate.md](../backend_docs/auth/userAuthenticate.md) |
| `backend/src/controllers/problemsControllers.js` | [backend_docs/controllers/problemsControllers.md](../backend_docs/controllers/problemsControllers.md) |
| `backend/src/controllers/userSubmission.js` | [backend_docs/controllers/userSubmission.md](../backend_docs/controllers/userSubmission.md) |
| `backend/src/controllers/videoSection.js` | [backend_docs/controllers/videoSection.md](../backend_docs/controllers/videoSection.md) |
| `backend/src/middlewares/userMiddleware.js` | [backend_docs/middleware/userMiddleware.md](../backend_docs/middleware/userMiddleware.md) |
| `backend/src/middlewares/adminMiddleware.js` | [backend_docs/middleware/adminMiddleware.md](../backend_docs/middleware/adminMiddleware.md) |
| `backend/src/middlewares/errorMiddleware.js` | [backend_docs/middleware/errorMiddleware.md](../backend_docs/middleware/errorMiddleware.md) |
| `backend/src/models/user.js` | [backend_docs/database/user.md](../backend_docs/database/user.md) |
| `backend/src/models/problems.js` | [backend_docs/database/problems.md](../backend_docs/database/problems.md) |
| `backend/src/models/submission.js` | [backend_docs/database/submission.md](../backend_docs/database/submission.md) |
| `backend/src/models/solutionVideo.js` | [backend_docs/database/solutionVideo.md](../backend_docs/database/solutionVideo.md) |
| `backend/src/services/judge0Service.js` | [backend_docs/services/judge0Service.md](../backend_docs/services/judge0Service.md) |
| `backend/src/utils/validate.js` | [backend_docs/utils/validate.md](../backend_docs/utils/validate.md) |
| `backend/src/utils/problemUtility.js` | [backend_docs/utils/problemUtility.md](../backend_docs/utils/problemUtility.md) |
| `backend/src/utils/asyncHandler.js` | [backend_docs/utils/asyncHandler.md](../backend_docs/utils/asyncHandler.md) |
| `backend/src/constants/judge0.js` | [backend_docs/constants/judge0.md](../backend_docs/constants/judge0.md) |
| `backend/src/constants/judgeStatus.js` | [backend_docs/constants/judgeStatus.md](../backend_docs/constants/judgeStatus.md) |
| `backend/src/seedProblems.js` | [backend_docs/database/seedProblems.md](../backend_docs/database/seedProblems.md) |

### Frontend

| Source file | Documentation |
|-------------|---------------|
| `frontend/src/main.jsx` | [frontend_docs/pages/main.md](../frontend_docs/pages/main.md) |
| `frontend/src/App.jsx` | [frontend_docs/pages/App.md](../frontend_docs/pages/App.md) |
| `frontend/src/authSlice.js` | [frontend_docs/state/authSlice.md](../frontend_docs/state/authSlice.md) |
| `frontend/src/store/store.js` | [frontend_docs/state/store.md](../frontend_docs/state/store.md) |
| `frontend/src/utils/axiosClient.js` | [frontend_docs/services/axiosClient.md](../frontend_docs/services/axiosClient.md) |
| `frontend/src/pages/*.jsx` | `frontend_docs/pages/<name>.md` |
| `frontend/src/components/*.jsx` | `frontend_docs/components/<name>.md` |
| `frontend/src/components/problem/*.jsx` | `frontend_docs/components/problem/<name>.md` |

## Feature → Docs Bundle

When working on a feature, update **all** of:

| Feature | Docs bundle |
|---------|-------------|
| Login/Signup | `authSlice`, `userAuthenticate`, `userAuth` routes, `AUTH_FLOW` |
| Homepage list | `Homepage`, `problemsControllers` (getAll, solved) |
| Code run/submit | `ProblemPage`, `userSubmission`, `judge0Service`, `API_FLOW` |
| Admin CRUD | `AdminPanel`, `AdminUpdate`, `AdminDelete`, `problemsControllers` |
| Video editorial | `AdminUpload`, `Editorial`, `videoSection`, `solutionVideo` |

## Suggested Tooling

### 1. Verify API doc drift (manual script stub)

Create `docs/scripts/verify-api-docs.js` to:

- Parse `backend/src/routes/*.js` for `Router.(get|post|put|delete)`
- Compare against markdown tables in `docs/API_FLOW.md`
- Exit non-zero on mismatch

### 2. Pre-commit hook (optional)

```bash
# .husky/pre-commit — example only
node docs/scripts/verify-api-docs.js
```

### 3. PR template snippet

```markdown
## Documentation
- [ ] Updated docs per DOC_UPDATE_CHECKLIST.md
- [ ] Ran change map: edited files listed in DOC_CHANGE_MAP.md
```

### 4. Import graph (optional)

```bash
npx madge --image docs/graphs/backend.svg backend/src/index.js
```

## Workflow Summary

1. Edit source file
2. Look up path in table above
3. Update file doc + flow docs from checklist
4. If file is a **bootstrap / main entry**, update [recommended_visit.md](./recommended_visit.md)
5. Bump `Last Reviewed` date
6. Fix inbound links found via search
