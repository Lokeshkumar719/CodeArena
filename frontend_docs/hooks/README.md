# Hooks Directory

There is **no** dedicated `frontend/src/hooks/` folder in this project.

## Where logic lives instead

| Concern | Location |
|---------|----------|
| Authentication (login, register, session check, logout) | Redux async thunks in [`../state/authSlice.md`](../state/authSlice.md) |
| Page-level data fetching | `useEffect` inside pages (`Homepage`, `ProblemPage`, admin list screens) |
| Form state | `react-hook-form` in `Login`, `Signup`, `AdminPanel`, `AdminUpdate`, `AdminUpload` |
| Problem solver UI state | Local `useState` / `useRef` in [`../pages/ProblemPage.md`](../pages/ProblemPage.md) |

## If you add custom hooks

1. Create `frontend/src/hooks/` (e.g. `useProblems.js`).
2. Add a matching doc under `frontend_docs/hooks/<hookName>.md`.
3. Update [FRONTEND_FLOW](../../docs/FRONTEND_FLOW.md) and [DEPENDENCY_GRAPH](../../docs/DEPENDENCY_GRAPH.md).

## Related

- [authSlice](../state/authSlice.md)
- [store](../state/store.md)
- [DOCS_GUIDELINES](../../docs/DOCS_GUIDELINES.md)

**Last reviewed:** 2026-05-18
