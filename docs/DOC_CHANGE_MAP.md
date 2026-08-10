# Change-Aware Documentation Map

**Purpose:** When you edit source code, find the exact doc file(s) to update.  
**Last reviewed:** 2026-05-18

## Source → Documentation Mapping

### Backend

| Source file | Documentation |
|-------------|---------------|
| `backend/src/index.js` | `backend_docs/config/index.md` |
| `backend/src/config/*.js` | `backend_docs/config/<name>.md` |
| `backend/src/routes/<area>/*.js` | `backend_docs/routes/<area>/<name>.md` |
| `backend/src/controllers/<area>/*.js` | `backend_docs/controllers/<area>/<name>.md` |
| `backend/src/middlewares/<area>/*.js` | `backend_docs/middlewares/<area>/<name>.md` |
| `backend/src/models/*.js` | `backend_docs/models/<name>.md` |
| `backend/src/services/<area>/*.js` | `backend_docs/services/<area>/<name>.md` |
| `backend/src/utils/<area>/*.js` | `backend_docs/utils/<area>/<name>.md` |
| `backend/src/constants/*.js` | `backend_docs/constants/<name>.md` |

### Frontend

| Source file | Documentation |
|-------------|---------------|
| `frontend/src/main.jsx` | [frontend_docs/pages/main.md](../frontend_docs/pages/main.md) |
| `frontend/src/App.jsx` | [frontend_docs/pages/App.md](../frontend_docs/pages/App.md) |
| `frontend/src/authSlice.js` | [frontend_docs/state/authSlice.md](../frontend_docs/state/authSlice.md) |
| `frontend/src/store/store.js` | [frontend_docs/state/store.md](../frontend_docs/state/store.md) |
| `frontend/src/utils/axiosClient.js` | [frontend_docs/services/axiosClient.md](../frontend_docs/services/axiosClient.md) |
| `frontend/src/utils/*.js` | `frontend_docs/utils/<name>.md` |
| `frontend/src/pages/*.jsx` | `frontend_docs/pages/<name>.md` |
| `frontend/src/components/<area>/*.jsx` | `frontend_docs/components/<area>/<name>.md` |

## Feature → Docs Bundle

When working on a feature, update **all** of:

| Feature | Docs bundle |
|---------|-------------|
| Login/Signup | `authSlice`, `authController`, `authRoutes`, `AUTH_FLOW` |
| Homepage list | `Homepage`, `problemController` (getAll, solved), `listProblems` |
| Code run/submit | `ProblemPage`, `submissionController`, `executionService`, `API_FLOW` |
| Admin CRUD | `CreateProblem`, `UpdateProblem`, `DeleteProblem`, `problemController`, `storageServices` |
| Video editorial | `UploadVideoSolution`, `ManageVideoSolutions`, `Editorial`, `videoController`, `solutionVideo` |

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
