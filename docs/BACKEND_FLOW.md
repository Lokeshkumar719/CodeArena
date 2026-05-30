# Backend Flow

**Entry:** `backend/src/index.js`  
**Pattern:** Routes → Rate Limiters → Auth Middleware → Controllers → Services → Models  
**Last reviewed:** 2026-05-29

## Server Startup

```
index.js
  dotenv.config()
  express app
  trust proxy 1 (needed for IP rate limiting)
  cors (multi-origin array) + json (50mb limit) + cookieParser
  mount routers: /user, /problem, /submission, /video
  errorMiddleware (last)
  initialiseConnection():
    Promise.all([ mongoose.connect(), connectRedis() ])
    app.listen(PORT)
```
Graceful shutdown handles `redisClient.quit()` on SIGINT.

## Request Lifecycle

```mermaid
flowchart LR
  R[Route] --> RL{Rate Limiter?}
  RL -->|429 Too Many| BL[Blocked - 429 headers]
  RL -->|Pass| M{Auth Middleware?}
  
  M -->|userMiddleware| JWT Verify → User lookup → req.user
  M -->|adminMiddleware| req.user.role === admin → 403 if not
  M -->|none| C[Controller asyncHandler]
  M --> C
  
  C --> DB[(Mongoose)]
  C --> Svc[Services]
  
  Svc --> Redis[(Redis - Sessions/Tokens)]
  Svc --> J0[judge0Service]
  Svc --> Mail[emailService]
  
  C --> CL[Cloudinary API]
  C --> Res[Response]
  C -.->|throw| E[errorMiddleware]
```

## Layer Responsibilities

| Layer | Location | Role |
|-------|----------|------|
| Routes | `src/routes/*.js` | HTTP method + path + middleware binding |
| Middleware | `src/middlewares/` | Auth (JWT), Rate Limiting (Redis), global errors |
| Controllers | `src/controllers/` | Request/response handling, HTTP status codes |
| Services | `src/services/` | Business logic (auth, tokens, problem queries, execution) |
| Models | `src/models/` | Mongoose schemas (User, Problem, Submission, Counters) |
| Config | `src/config/` | DB, Redis client, Judge0 axios client |
| Utils | `src/utils/` | Query builders, Base64 encoding, Judge0 result parsers |
| Constants | `src/constants/` | HTTP codes, Auth token config, Judge0 enums |

## Service Modules

The codebase extracts significant business logic into the `services` directory:

### Auth Services
- `authService.js`: Registration, login orchestration, Redis storage
- `tokenService.js`: JWT sign/verify
- `refreshSessionService.js`: Token rotation logic, session validation
- `emailService.js`: Resend API integration for password reset

### Problem Services
- `listingProblems.js`: Advanced querying (search, filter, pagination, `isSolved` annotation)
- `validateReferenceSolutions.js`: Execution verification during problem creation
- `attachVideoDetails.js`: Joining Cloudinary data to problem responses

### Execution Service
- `executionService.js`: Orchestrates batching testcases, calling Judge0, parsing results
- `judge0Service.js`: External HTTP client to RapidAPI (base64 encode/decode)

## Rate Limiting Architecture

Implemented in `rateLimitMiddleware.js` using Redis:
- **Token Bucket (Lua)**: Used for `/submission/run` and `/submission/submit`. Lazy-refills tokens based on time. Keyed by authenticated `req.user._id`.
- **Fixed Window**: Used for `/user/login`, `/register`, `/forgot-password` (keyed by IP) and `/change-password` (keyed by `req.user._id`).
- Automatically adds standard `X-RateLimit-*` and `Retry-After` headers.
- Fails open if Redis is down.

## Authentication (Dual JWT)

- **Access Token:** Short-lived, checked by `userMiddleware` on every protected request.
- **Refresh Token:** Long-lived, hashed in Redis, used in `refreshAccessToken` to generate new token pairs (token rotation).

## Judge0 Integration Flow

Used by `validateReferenceSolutions` and `executionService`:

```
getLanguageById(language) → language_id
Map test cases → Base64 encode { source_code, language_id, stdin, expected_output }
submitBatch → tokens[]
submitToken → GET poll until all status.id > 2
Decode Base64 responses
Parse errors/limits (Memory/Output limit detection)
Compare to JUDGE0_STATUS.ACCEPTED (3)
```

## Related

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [API_FLOW.md](./API_FLOW.md)
- [DATABASE_FLOW.md](./DATABASE_FLOW.md)
