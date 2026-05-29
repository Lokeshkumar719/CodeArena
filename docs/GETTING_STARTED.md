# Getting Started

**Project:** CodeArena (`coding-platform/`)  
**Last reviewed:** 2026-05-29

## Prerequisites

- Node.js 18+ (LTS recommended)
- MongoDB instance (local or Atlas)
- Redis server (local or managed)
- RapidAPI account with Judge0 CE API key
- Cloudinary account (for editorial videos / admin upload)
- Resend account (for password reset emails)

## Repository Layout

```
coding-platform/
├── backend/          # Express API (default port 3000)
├── frontend/         # Vite dev server (default 5173)
└── docs/             # Architecture & navigation (this folder)
```

## Environment Variables

Create `coding-platform/backend/.env` (not in repo):

```env
PORT=3000
DB_CONNECT_STRING=mongodb://127.0.0.1:27017/codearena
JWT_KEY=your-access-token-secret
JWT_REFRESH_KEY=your-refresh-token-secret
REDIS_URL=redis://127.0.0.1:6379
RAPID_API_KEY=your-judge0-rapidapi-key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=your_resend_key
FRONTEND_URL=http://localhost:5173
```

Ensure `FRONTEND_URL` matches exactly where your Vite server runs, as it's used to construct password reset links.

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

Open `http://localhost:5173`. API must be reachable at `http://localhost:3000` (hardcoded in `frontend/src/utils/axiosClient.js`).

## First-Time Data

1. Register a user via UI (`/signup`).
2. **Admin access:** Requires `role: admin` in DB. Options:
   - Manually edit the MongoDB document to set `role: "admin"`, then login again.
   - Use `POST /user/admin/Register` programmatically with an existing admin session.
3. No automated seeder is currently maintained for all problem configurations.

## Onboarding Path for New Developers

See **[recommended_visit.md](./recommended_visit.md)** — entry points, read-first files, and step-by-step visit order.

Quick link: [DOC_INDEX.md](./DOC_INDEX.md) for the full file catalog.

## Common Dev Issues

| Symptom | Likely cause |
|---------|----------------|
| 401 on all API calls after login | Redis is down, or `JWT_KEY`/`JWT_REFRESH_KEY` changed |
| 429 Too Many Requests | Rate limit hit. Check Redis or wait the cooldown period |
| 403 on admin routes | User is not `role: admin` |
| Judge0 errors | Invalid `RAPID_API_KEY` or RapidAPI rate limits |
| Problem page infinite loader | Backend not running or Axios network error |
| Emails not sending | Invalid `RESEND_API_KEY` or domain not verified on Resend |

## Redis Requirement

**Redis is mandatory** for this application to run.
- It stores hashed refresh tokens for session rotation.
- It powers all rate-limiting via `rate-limiter-flexible` and custom Lua scripts.
- The app will not process code submissions or logins reliably without Redis.

## Related

- [DOC_INDEX.md](./DOC_INDEX.md)
- [DOCS_GUIDELINES.md](./DOCS_GUIDELINES.md)
