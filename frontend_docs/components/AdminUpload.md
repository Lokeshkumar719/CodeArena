# `frontend/src/components/AdminUpload.jsx`

**Source:** `frontend/src/components/AdminUpload.jsx`  
**Doc path:** `frontend_docs/components/AdminUpload.md`

# File Purpose

Upload an editorial solution video for one problem: signed upload to Cloudinary, then persist metadata on the backend.

# Responsibilities

- File picker validation (video type, max 100MB).
- Four-step upload: signature from API → multipart POST to Cloudinary → save metadata → show success.
- Progress bar during Cloudinary upload.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `AdminUpload` | default export | Upload UI |
| `onSubmit` | async | Full upload pipeline |
| `formatFileSize`, `formatDuration` | helpers | Display helpers |
| `useParams().problemId` | route | Target problem |

# Internal Logic

1. `GET /video/create/:problemId` → `{ signature, timestamp, public_id, api_key, cloud_name, upload_url }`.
2. Build `FormData` with file + signature fields.
3. `axios.post(upload_url, formData)` — **plain axios**, not `axiosClient` (direct to Cloudinary).
4. `POST /video/save` with `problemId`, `cloudinaryPublicId`, `secureUrl`, `duration`.
5. `setUploadedVideo(metadataResponse.data.videoSolution)`; `reset()` form.

`watch('videoFile')` shows selected file info before upload.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| Video file | Cloudinary asset + DB video solution record |
| Success | Alert with duration and `uploadedAt` |

# Dependencies

| Module | Role |
|--------|------|
| `react-hook-form` | File field + validation |
| `axios` | Cloudinary upload only |
| `../utils/axiosClient` | Signature + save |
| `react-router` | `useParams` |

# Used By

- [`../pages/App.md`](../pages/App.md) — `/admin/upload/:problemId`

# API Connections

| Step | Method | Path / URL |
|------|--------|------------|
| 1 | GET | `/video/create/:problemId` (via axiosClient) |
| 2 | POST | Cloudinary `upload_url` (via axios) |
| 3 | POST | `/video/save` (via axiosClient) |

See [`../../docs/API_FLOW.md`](../../docs/API_FLOW.md) and backend video controller when documented under `../../backend_docs/`.

# Database Connections

Frontend none; backend `solutionVideo` / problem linkage on save.

# State/Context Dependencies

Local: `uploading`, `uploadProgress`, `uploadedVideo`; form errors via RHF `setError('root', ...)`.

# Related Files

- [`Editorial.md`](./Editorial.md)
- [`AdminVideo.md`](./AdminVideo.md)

# Next Files To Read

1. Backend `videoSection` controller
2. [`Editorial.md`](./Editorial.md)

# Common Risks / Notes

- Cloudinary credentials exposed to client only as signed upload params (expected pattern).
- `uploadProgress` reset to 0 in `finally` even on success — progress bar disappears immediately after complete.
- No navigation back to admin video list on success.

# Last Reviewed: 2026-05-18
