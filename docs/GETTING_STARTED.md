# Getting Started

**Project:** CodeArena (`coding-platform/`)  
**Last reviewed:** 2026-05-18

## Prerequisites

- Node.js 18+ (LTS recommended)
- MongoDB instance (local or Atlas)
- Redis server
- RapidAPI account with Judge0 CE API key
- Cloudinary account (for editorial videos / admin upload)

## Repository Layout

```
coding-platform/
├── backend/          # Express API (port from env, typically 3000)
├── frontend/         # Vite dev server (default 5173)
└── docs/             # Architecture & navigation (this folder)
```

## Environment Variables

Create `coding-platform/backend/.env` (not in repo):

```env
PORT=3000
DB_CONNECT_STRING=mongodb://127.0.0.1:27017/codearena
JWT_KEY=your-long-random-secret
REDIS_URL=redis://127.0.0.1:6379
RAPID_API_KEY=your-rapidapi-key
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Uncertainty:** Exact variable names are inferred from `process.env.*` usage in source; verify before production deploy.

## Install & Run

### Backend

```bash
cd coding-platform/backend
npm install
npm run dev
```

### Frontend

```bash
cd coding-platform/frontend
npm install
npm run dev
```

Open `http://localhost:5173`. API must be reachable at `http://localhost:3000` (hardcoded in `axiosClient.js`).

## First-Time Data

1. Register a user via UI (`/signup`) **or** use API `POST /user/register`.
2. **Admin access:** Requires `role: admin` in DB. Options:
   - Manually set role in MongoDB, then login again, **or**
   - `POST /user/admin/Register` with an existing admin cookie (no UI for this).
3. Optional: run seed script (update `ADMIN_USER_ID` in `seedProblems.js` first):

```bash
cd coding-platform/backend
node src/seedProblems.js
```

## Onboarding Path for New Developers

See **[recommended_visit.md](./recommended_visit.md)** — entry points, read-first files, and step-by-step visit order.

Quick link: [DOC_INDEX.md](./DOC_INDEX.md) for the full file catalog.

## Common Dev Issues

| Symptom | Likely cause |
|---------|----------------|
| 401 on all API calls after login | `userMiddleware` admin-only bug; CORS/credentials mismatch |
| Judge0 errors | Invalid `RAPID_API_KEY` or rate limits |
| Cookie not sent | Frontend not using `withCredentials`; wrong origin in CORS |
| Problem page empty | Not authenticated while API requires cookie |

## Related

- [DOC_INDEX.md](./DOC_INDEX.md)
- [DOCS_GUIDELINES.md](./DOCS_GUIDELINES.md)
