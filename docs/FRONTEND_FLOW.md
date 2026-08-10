# Frontend Flow

**Stack:** React 19 + Vite + React Router 7 + Redux Toolkit  
**Entry:** `frontend/src/main.jsx` → `App.jsx`  
**Last reviewed:** 2026-05-29

## Bootstrap Sequence

```
index.html
  → main.jsx
      Provider(store)
      BrowserRouter
      Toaster (react-hot-toast)
      App.jsx
        useEffect → dispatch(checkAuth())
        loading spinner OR <Routes>
        NProgress integration (RouteProgress component)
```

## Routing Map

| Path | Component | Auth | Redirect logic |
|------|-----------|-------------|----------------|
| `/` | `LandingPage` | Guest | Authed → `/problems` |
| `/problems` | `Homepage` | Authenticated | Guests → `/` |
| `/login` | `Login` | Guest | Authed → `/` |
| `/signup` | `Signup` | Guest | Authed → `/` |
| `/forgot-password` | `ForgotPassword` | Guest | Authed → `/` |
| `/reset-password/:token` | `ResetPassword`| Guest | Authed → `/` |
| `/change-password` | `ChangePassword` | Authenticated | Guests → `/login` |
| `/check-email` | `CheckEmail` | Guest | Authed → `/` |
| `/verify-email/:token` | `VerifyEmail` | Guest | Authed → `/` |
| `/resend-verification` | `ResendVerification` | Any | — |
| `/profile/:username` | `Profile` | Any | — |
| `/profile/edit` | `EditProfile` | Any | — |
| `/problem/:slug` | `ProblemPage` | Authenticated | Guests → `/login` |
| `/admin` | `Admin` | Admin | Non-admin → `/` |
| `/admin/create` | `CreateProblem` | Admin | Non-admin → `/` |
| `/admin/delete` | `DeleteProblem` | Admin | Non-admin → `/` |
| `/admin/update-list` | `UpdateProblemList` | Admin | Non-admin → `/` |
| `/admin/update/:id` | `UpdateProblem` | Admin | Non-admin → `/` |
| `/admin/video` | `ManageVideoSolutions` | Admin | Non-admin → `/` |
| `/admin/upload/:problemId` | `UploadVideoSolution` | Admin | Non-admin → `/` |

## State Management

Only **one Redux slice**: `auth` (`authSlice.js`).

All other data is **local component state** (`useState` + `useEffect` fetch):

- Problem list, filters (debounce, state), pagination → `Homepage`
- Problem detail, editor (Monaco), run/submit results → `ProblemPage`
- Submissions table → `SubmissionHistory`
- Admin forms → respective Admin components
- Rate limits → `useRateLimit` custom hook

## API Client Pattern

```javascript
// frontend/src/utils/axiosClient.js
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
withCredentials: true  // sends JWT cookies
```

The `axiosClient` has an **interceptor** that handles:
1. **Rate limits (429):** Extracts `retryAfterSeconds` from the response and attaches it as `error.rateLimitedFor` for UI components.
2. **Silent refresh (401):** On a 401 error, if it's not the refresh endpoint itself, it silently calls `POST /user/refresh` to get a new access token and then retries the original request.

All API calls throughout the application use this configured `axiosClient`.

## Component Flows

### Homepage (Problem List)

- **Search:** Controlled input with `useDebounce` hook (400ms delay) to prevent spamming the API.
- **Filters:** Custom `<CustomSelect>` component for OS-independent styling of Difficulty and Status. Custom multi-select panel for Tags.
- **Pagination:** Server-side pagination controls.
- **Skeleton loading:** Renders `ProblemListSkeleton` while fetching data.

### Problem Page UI Flow

```
ProblemPage (resizable split-layout)
├── Left panel (tabs: description | editorial | solutions | submissions)
│   ├── ProblemDescription
│   ├── Editorial (video player)
│   ├── referenceSolution cards
│   └── SubmissionHistory
└── Right panel (tabs: code | testcase | result)
    ├── CodeEditorPanel (Monaco + LanguageSelector)
    ├── TestCasePanel (run results)
    ├── ResultPanel (submit results)
    └── Action buttons (Run/Submit buttons with rate limit cooldowns)
```

**Run:** `POST /submission/run/:id` → sets `activeRightTab = "testcase"`
**Submit:** `POST /submission/submit/:id` → sets `activeRightTab = "result"`

Buttons automatically enter a countdown state when a 429 response is received, leveraging the `useRateLimit` hook.

## Styling & UX

- Global: `index.css` + Tailwind 3 + DaisyUI 5
- Problem workspace: `ProblemPage.css` (custom draggable split layout)
- Skeletons: Extensive use of custom skeleton components in `src/components/skeletons/` (AdminCard, ProblemCard, Tables, Upload)
- Route transitions: `NProgress` bar at the top of the screen

## Forms

- **Authentication:** `react-hook-form` + `zodResolver` (Zod schemas).
- **Admin problem creation/update:** Complex dynamic forms.
- **Validation:** Follows backend rules (e.g., strong password requirements, required problem fields).

## Related

- [frontend_docs/pages/](../frontend_docs/pages/)
- [frontend_docs/components/](../frontend_docs/components/)
- [DEPENDENCY_GRAPH.md](./DEPENDENCY_GRAPH.md)
