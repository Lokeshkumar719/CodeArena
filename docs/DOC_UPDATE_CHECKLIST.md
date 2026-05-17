# Documentation Update Checklist

Use this checklist on every PR that changes application behavior.

## Routes & API

- [ ] New/changed route documented in `backend_docs/routes/`
- [ ] Controller doc updated (`backend_docs/controllers/`)
- [ ] `docs/API_FLOW.md` endpoint table updated
- [ ] Frontend caller doc updated (`Used By` / API Connections)
- [ ] `docs/DEPENDENCY_GRAPH.md` cross-stack table updated if new coupling

## Frontend

- [ ] Page/component doc updated under `frontend_docs/`
- [ ] `docs/FRONTEND_FLOW.md` routing table updated (if routes changed)
- [ ] `axiosClient` or direct API calls reflected in component docs

## Auth

- [ ] `docs/AUTH_FLOW.md` updated if JWT, cookies, or middleware logic changed
- [ ] `backend_docs/middleware/` or `auth/` updated
- [ ] `frontend_docs/state/authSlice.md` updated
- [ ] Route guards in `App.jsx` documented if changed

## Database

- [ ] Mongoose model doc updated (`backend_docs/database/`)
- [ ] `docs/DATABASE_FLOW.md` ER / query notes updated
- [ ] Hooks/indexes documented

## Architecture

- [ ] `docs/ARCHITECTURE.md` updated for new services, integrations, or feature boundaries
- [ ] Changelog entry added for significant structural changes

## Navigation

- [ ] `docs/DOC_INDEX.md` links added/removed
- [ ] Related Files links fixed in neighboring docs
- [ ] `Last Reviewed` date bumped on touched docs

## Quality

- [ ] No hallucinated endpoints (verified against `routes/*.js`)
- [ ] Uncertainties labeled explicitly
- [ ] Risks/bugs noted (especially auth and Judge0)

## Optional Automation

- [ ] Ran `node docs/scripts/verify-api-docs.js` (if present)
- [ ] Updated `DOC_CHANGE_MAP.md` source→doc mapping for renamed files
