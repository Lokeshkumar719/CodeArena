# WebSocket Layer

## Status: Not Implemented

The CodeArena backend at `coding-platform/backend` has **no WebSocket server** and no Socket.IO (or similar) dependency in `package.json`.

A repository-wide search of `backend/src` shows:

- No `ws`, `socket.io`, or `WebSocket` imports
- No upgrade handlers on the Express `app` in [../config/index.md](../config/index.md)
- All realtime-adjacent behavior (code run/submit, auth check) uses **HTTP request/response** only

## How the app works without WebSockets

| Concern | Mechanism |
|---------|-----------|
| Code run / submit | `POST /submission/run/:id`, `POST /submission/submit/:id` — Judge0 polling happens server-side in [../services/judge0Service.md](../services/judge0Service.md) |
| Session validity | `GET /user/check` with httpOnly cookie |
| Problem updates | Client refetches REST endpoints |

See [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) and [../docs/API_FLOW.md](../docs/API_FLOW.md) for the HTTP-based design.

## If adding WebSockets later

Document new files under `backend_docs/websocket/` and update:

- [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- [../config/index.md](../config/index.md)
- [../docs/DOC_CHANGE_MAP.md](../docs/DOC_CHANGE_MAP.md)

# Last Reviewed: 2026-05-18
