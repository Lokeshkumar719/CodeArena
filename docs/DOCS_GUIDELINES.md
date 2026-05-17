# Documentation Guidelines

**Last reviewed:** 2026-05-18

## Purpose

Keep architecture and file-level documentation accurate as the codebase evolves. Docs live beside the app under `coding-platform/docs/`, `frontend_docs/`, and `backend_docs/`.

## Where Docs Belong

| Change type | Update location |
|-------------|-----------------|
| New/changed Express route | `backend_docs/routes/<router>.md` + `docs/API_FLOW.md` |
| New/changed controller | `backend_docs/controllers/<name>.md` |
| New/changed model | `backend_docs/database/<model>.md` + `docs/DATABASE_FLOW.md` |
| Auth / JWT / middleware | `backend_docs/middleware/` or `auth/` + `docs/AUTH_FLOW.md` |
| New React page | `frontend_docs/pages/<Page>.md` + `docs/FRONTEND_FLOW.md` |
| New component | `frontend_docs/components/` |
| Redux / global state | `frontend_docs/state/` |
| HTTP client / API usage | `frontend_docs/services/` |
| Cross-cutting architecture | `docs/ARCHITECTURE.md`, `DEPENDENCY_GRAPH.md` |

**No WebSocket docs** unless realtime is added — then create `backend_docs/websocket/` and update `ARCHITECTURE.md`.

## Naming Conventions

- File-level doc name **matches source file** without extension: `userSubmission.js` → `userSubmission.md`
- Use relative links: `[authSlice](../frontend_docs/state/authSlice.md)`
- Section headers in every file doc (required template):
  - File Purpose, Responsibilities, Main Functions / Components / Classes, Internal Logic, Inputs and Outputs, Dependencies, Used By, API Connections, Database Connections, State/Context Dependencies, Related Files, Next Files To Read, Common Risks / Notes, Last Reviewed

## When Docs Must Be Updated

| Trigger | Required updates |
|---------|------------------|
| New API endpoint | Route doc, controller doc, `API_FLOW.md`, `DEPENDENCY_GRAPH.md` if new coupling |
| Changed request/response shape | Controller doc + any frontend component doc calling it |
| New Mongoose field | Model doc + `DATABASE_FLOW.md` |
| Auth behavior change | Middleware doc, `AUTH_FLOW.md`, `authSlice.md` |
| New npm dependency used in code | Mention in relevant file doc; optional `ARCHITECTURE.md` stack table |
| Renamed/moved file | Move doc, fix all inbound links in `DOC_INDEX.md` |

## Link Maintenance

1. Search repo docs for old path: `rg "oldFileName" docs frontend_docs backend_docs`
2. Update `DOC_INDEX.md` hub links
3. Update "Used By" / "Related Files" sections in neighbor docs

## Recording Architecture Changes

Add a short dated note at the bottom of `ARCHITECTURE.md` under `## Changelog` when:

- Adding a new service (e.g. payment, queue)
- Changing auth mechanism
- Splitting monolith packages

Example:

```markdown
### 2026-06-01
- Replaced cookie JWT with refresh tokens (see AUTH_FLOW.md).
```

## Writing Style

- Describe **behavior from code**, not aspirations
- Mark **Uncertain** when env or deployment is not in repo
- Call out bugs and tech debt in "Common Risks / Notes"
- Avoid empty filler; every section should help onboarding

## Review Cadence

- Update `Last Reviewed: YYYY-MM-DD` on any doc you touch
- Quarterly: skim `recommended_visit.md`, `DOC_INDEX.md`, and `API_FLOW.md` endpoint table

When adding a new **entry point** (bootstrap file, main router, or primary feature page), update [recommended_visit.md](./recommended_visit.md).

## Related

- [DOC_UPDATE_CHECKLIST.md](./DOC_UPDATE_CHECKLIST.md)
- [DOC_CHANGE_MAP.md](./DOC_CHANGE_MAP.md)
