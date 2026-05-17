# File Purpose

Express router for admin editorial video workflows (Cloudinary signed upload + metadata persistence). Mounted at `/video` in `index.js`.

# Responsibilities

- Restrict all routes to `adminMiddleware`
- Expose signature generation, metadata save, and video delete by problem id

# Main Functions / Components / Classes

| Route | Middleware | Handler |
|-------|------------|---------|
| `GET /create/:problemId` | `adminMiddleware` | `generateUploadSignature` |
| `POST /save` | `adminMiddleware` | `saveVideoMetadata` |
| `DELETE /delete/:problemId` | `adminMiddleware` | `deleteVideo` |

Export: `videoRouter`.

# Internal Logic

No business logic in router file. Flow:

1. Admin gets signed upload params from `GET /video/create/:problemId`
2. Browser uploads directly to Cloudinary
3. Admin posts metadata to `POST /video/save`
4. Optional `DELETE /video/delete/:problemId` removes DB row and Cloudinary asset

# Inputs and Outputs

| Endpoint | Input | Output |
|----------|-------|--------|
| `GET /video/create/:problemId` | param `problemId` | signature, timestamp, `public_id`, api_key, cloud_name, `upload_url` |
| `POST /video/save` | body: `problemId`, `cloudinaryPublicId`, `secureUrl`, `duration` | `201` + video summary |
| `DELETE /video/delete/:problemId` | param `problemId` | JSON message |

# Dependencies

**Internal:** `../controllers/videoSection`, `../middlewares/adminMiddleware`

# Used By

- [../config/index.md](../config/index.md)
- `frontend/src/components/AdminUpload.jsx`

# API Connections

- **Cloudinary** REST (via controller): resource verify, destroy, signed upload URL
- Not Judge0

# Database Connections

`SolutionVideo`, `Problem` (existence check) via controller.

# State/Context Dependencies

- `req.result._id` used when building `public_id` for uploads
- Cloudinary env vars required in controller

# Related Files

- [../controllers/videoSection.md](../controllers/videoSection.md)
- [../database/solutionVideo.md](../database/solutionVideo.md)
- [../middleware/adminMiddleware.md](../middleware/adminMiddleware.md)

# Next Files To Read

1. [../controllers/videoSection.md](../controllers/videoSection.md)
2. [../database/solutionVideo.md](../database/solutionVideo.md)

# Common Risks / Notes

- `deleteVideo` finds by `problemId` only (not `userId`) — deletes first matching video for problem.
- `saveVideoMetadata` duplicate check includes `userId` + `cloudinaryPublicId`.
- `User` model is imported in controller but unused in current `videoSection.js` source.

# Last Reviewed: 2026-05-18
