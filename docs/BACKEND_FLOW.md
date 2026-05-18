# Backend Flow

**Entry:** `backend/src/index.js`  
**Pattern:** Routes → Middleware → Controllers → Models / Services  
**Last reviewed:** 2026-05-18

## Server Startup

```
index.js
  dotenv.config()
  express app + cors + json + cookieParser
  mount routers: /user, /problem, /submission, /video
  errorMiddleware (last)
  initialiseConnection():
    Promise.all([ mongoose.connect(), redis.connect() ])
    app.listen(PORT)
```

## Request Lifecycle

```mermaid
flowchart LR
  R[Route] --> M{Middleware?}
  M -->|userMiddleware| JWT + Redis + User lookup → req.user
  M -->|adminMiddleware| req.user.role === admin → 403 if not
  M -->|none| C[Controller asyncHandler]
  M --> C
  C --> DB[(Mongoose)]
  C --> J0[judge0Service]
  C --> CL[Cloudinary API]
  C --> Res[Response]
  C -.->|throw| E[errorMiddleware 500]
```

## Layer Responsibilities

| Layer | Location | Role |
|-------|----------|------|
| Routes | `src/routes/*.js` | HTTP method + path + middleware binding |
| Middleware | `src/middlewares/` | Auth, global errors |
| Controllers | `src/controllers/` | Business logic, HTTP status codes |
| Services | `src/services/judge0Service.js` | Judge0 batch submit + poll |
| Models | `src/models/` | Mongoose schemas |
| Config | `src/config/` | DB, Redis, Judge0 axios client |
| Utils | `src/utils/` | Validation, async wrapper, language IDs |
| Constants | `src/constants/` | Judge0 language IDs, status enums |

## Judge0 Integration Flow

Used by:

- `problemsControllers.createProblem` / `updateProblem` (validate reference solutions)
- `userSubmission.submitCode` / `runCode`

```
getLanguageById(language) → language_id
Map test cases → { source_code, language_id, stdin, expected_output }
submitBatch → tokens[]
submitToken → poll until all status.id > 2
Compare to JUDGE0_STATUS.ACCEPTED (3)
```

## Standalone Scripts

- `seedProblems.js` — connects to MongoDB, seeds sample problems (requires hardcoded `ADMIN_USER_ID`)

## Dependencies Declared but Unused in `index.js`

- `helmet`, `morgan`, `rate-limiter-flexible` — present in `package.json`, not imported in entry file.

## Related

- [API_FLOW.md](./API_FLOW.md)
- [backend_docs/](../backend_docs/)
