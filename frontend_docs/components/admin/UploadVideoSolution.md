# `frontend/src/components/admin/UploadVideoSolution.jsx`

**Source:** `frontend/src/components/admin/UploadVideoSolution.jsx`  
**Doc path:** `frontend_docs/components/admin/UploadVideoSolution.md`

# File Purpose

Upload an editorial solution video for one problem by saving a YouTube URL to the backend.

# Responsibilities

- Input validation (valid YouTube URL format).
- Submit URL to backend `POST /video/upload/:problemId`.
- Provide success feedback and navigate back to list.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `UploadVideoSolution` | default export | Upload UI |
| `onSubmit` | async | URL submission |
| `useParams().problemId` | route | Target problem |

# Internal Logic

1. Collects `youtubeUrl` from the input via `react-hook-form`.
2. Validates hostname belongs to `youtube.com`, `www.youtube.com`, or `youtu.be`.
3. `POST /video/upload/:problemId` via `axiosClient` with `{ youtubeUrl }`.
4. Navigates to `/admin/video` on success.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| Form `youtubeUrl` | API request body |

# Dependencies

| Module | Role |
|--------|------|
| `react-hook-form` | Form state and validation |
| `../utils/axiosClient` | API requests |
| `react-hot-toast` | Toast notifications |
| `react-router` | `useParams` |

- [`App.jsx`](../pages/App.md) — Renders at `/admin/upload/:problemId`

