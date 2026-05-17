# Frontend Flow

**Stack:** React 19 + Vite + React Router 7 + Redux Toolkit  
**Entry:** `frontend/src/main.jsx` → `App.jsx`  
**Last reviewed:** 2026-05-18

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
```

## Routing Map

| Path | Component | Auth (UI) |
|------|-----------|-------------|
| `/` | `Homepage` | Authenticated |
| `/login` | `Login` | Guest only |
| `/signup` | `Signup` | Guest only |
| `/problem/:problemId` | `ProblemPage` | **None** |
| `/admin` | `Admin` | Admin |
| `/admin/create` | `AdminPanel` | Admin |
| `/admin/delete` | `AdminDelete` | Admin |
| `/admin/update-list` | `AdminUpdateList` | Admin |
| `/admin/update/:id` | `AdminUpdate` | Admin |
| `/admin/video` | `AdminVideo` | Admin |
| `/admin/upload/:problemId` | `AdminUpload` | Admin |

## State Management

Only **one Redux slice**: `auth` (`authSlice.js`).

All other data is **local component state** (`useState` + `useEffect` fetch):

- Problem list, filters, pagination → `Homepage`
- Problem detail, editor, run/submit results → `ProblemPage`
- Submissions table → `SubmissionHistory`
- Admin forms → respective Admin components

**No React Context providers** beyond Redux `Provider`.

**No custom hooks directory** — logic lives inline in components or thunks.

## API Client Pattern

```javascript
// frontend/src/utils/axiosClient.js
baseURL: 'http://localhost:3000'
withCredentials: true  // sends JWT cookie
```

Direct `axios` (not `axiosClient`) used only for Cloudinary upload in `AdminUpload.jsx`.

## Problem Page UI Flow

```
ProblemPage
├── Left panel (tabs: description | editorial | solutions | submissions)
│   ├── ProblemDescription
│   ├── Editorial (video player)
│   ├── referenceSolution cards (from problem payload)
│   └── SubmissionHistory
└── Right panel (tabs: code | testcase | result)
    ├── CodeEditorPanel (Monaco + LanguageSelector + ActionBar)
    ├── TestCasePanel (run results)
    └── ResultPanel (submit results)
```

**Run:** `POST /submission/run/:id` → sets `activeRightTab = "testcase"`  
**Submit:** `POST /submission/submit/:id` → sets `activeRightTab = "result"`

## Styling

- Global: `index.css` + Tailwind + DaisyUI (`tailwind.config.js`)
- Problem workspace: `ProblemPage.css` (custom split layout, badges)

## Forms

- Login/Signup: `react-hook-form` + `zodResolver`
- Admin create/update: large Zod schemas + `useFieldArray` for test cases and starter code

## Related

- [frontend_docs/pages/](../frontend_docs/pages/)
- [frontend_docs/components/](../frontend_docs/components/)
- [DEPENDENCY_GRAPH.md](./DEPENDENCY_GRAPH.md)
