# API Flow Map

**Base URL (dev):** `http://localhost:3000`  
**Client:** `frontend/src/utils/axiosClient.js` (`withCredentials: true`)  
**Last reviewed:** 2026-05-18

## Route Mount Points

Defined in `backend/src/index.js`:

| Mount | Router file | Purpose |
|-------|-------------|---------|
| `/user` | `routes/userAuth.js` | Registration, login, logout, session check |
| `/problem` | `routes/problemCreator.js` | Problem CRUD + reads + submission history |
| `/submission` | `routes/submit.js` | Run & submit code |
| `/video` | `routes/videoCreator.js` | Cloudinary upload signing & metadata |

## End-to-End Flows

### 1. User registration

```
Signup.jsx → dispatch(registerUser)
  → POST /user/register { firstName, emailId, password }
  → userAuthenticate.register → validate → bcrypt → User.create
  → JWT in httpOnly cookie `token` → { user, message }
  → Redux auth.fulfilled → navigate /
```

### 2. User login

```
Login.jsx → POST /user/login { emailId, password }
  → bcrypt.compare → JWT cookie (role from DB) → { user }
```

### 3. Session check (app load)

```
App.jsx → dispatch(checkAuth)
  → GET /user/check (userMiddleware)
  → { user: { firstName, emailId, _id, role } }
```

### 4. Problem list (homepage)

```
Homepage.jsx
  → GET /problem/getAllProblems?page=&limit=5
  → GET /problem/problemSolvedByUser
```

### 5. Open problem & run code

```
ProblemPage.jsx
  → GET /problem/problemById/:id
  → POST /submission/run/:id { code, language }
       → visible test cases only → Judge0 batch → poll → JSON result
```

### 6. Submit solution

```
ProblemPage.jsx
  → POST /submission/submit/:id { code, language }
       → visible + hidden test cases → Submission document
       → Judge0 → update submission + $addToSet problemSolved if accepted
```

### 7. Submission history

```
SubmissionHistory.jsx
  → GET /problem/problemSubmmision/:problemId  (typo in route name)
```

### 8. Admin create problem

```
AdminPanel.jsx
  → POST /problem/create (adminMiddleware)
       → validates reference solutions against visible tests via Judge0
       → Problem.create
```

### 9. Admin video upload

```
AdminUpload.jsx
  → GET /video/create/:problemId → signature + Cloudinary params
  → POST to Cloudinary (plain axios, not axiosClient)
  → POST /video/save { problemId, cloudinaryPublicId, secureUrl, duration }
```

## Complete Endpoint Reference

### `/user` (auth)

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| POST | `/register` | — | `register` |
| POST | `/login` | — | `login` |
| POST | `/logout` | `userMiddleware` | `logout` |
| GET | `/check` | `userMiddleware` | inline JSON |
| POST | `/admin/Register` | `adminMiddleware` | `adminRegister` |
| DELETE | `/profile` | `userMiddleware` | `deleteProfile` |

### `/problem`

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| POST | `/create` | `adminMiddleware` | `createProblem` |
| PUT | `/update/:id` | `adminMiddleware` | `updateProblem` |
| DELETE | `/delete/:id` | `adminMiddleware` | `deleteProblem` |
| GET | `/admin/problemById/:id` | `adminMiddleware` | `getProblemByIdAdmin` |
| GET | `/problemById/:id` | `userMiddleware` | `getProblemById` |
| GET | `/getAllProblems` | `userMiddleware` | `getAllProblems` |
| GET | `/problemSolvedByUser` | `userMiddleware` | `solvedProblems` |
| GET | `/problemSubmmision/:id` | `userMiddleware` | `submittedProblem` |

### `/submission`

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| POST | `/submit/:id` | `userMiddleware` | `submitCode` |
| POST | `/run/:id` | `userMiddleware` | `runCode` |

### `/video`

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| GET | `/create/:problemId` | `adminMiddleware` | `generateUploadSignature` |
| POST | `/save` | `adminMiddleware` | `saveVideoMetadata` |
| DELETE | `/delete/:problemId` | `adminMiddleware` | `deleteVideo` |

## External API: Judge0

- Client: `backend/src/config/judge0Client.js` → `https://judge0-ce.p.rapidapi.com`
- Service: `submitBatch` POST `/submissions/batch`, `submitToken` GET poll until `status.id > 2`
- Languages: cpp (54), java (62), javascript (63)

## Error Handling

Global `errorMiddleware` returns `500` with `{ success: false, message }`. Controllers also return `400`/`404` directly. Async errors from `asyncHandler` propagate to this middleware.

## Related

- [AUTH_FLOW.md](./AUTH_FLOW.md)
- [backend_docs/routes/](../backend_docs/routes/) per-route docs
- [DOC_INDEX.md](./DOC_INDEX.md)
