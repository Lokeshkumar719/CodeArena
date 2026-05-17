# File Purpose

Controller for Cloudinary-backed solution video uploads: signed upload parameters, post-upload metadata persistence, and deletion.

# Responsibilities

- Configure Cloudinary SDK from environment
- Verify problem exists before signing upload
- Generate signed upload credentials for direct browser upload
- Verify Cloudinary resource exists before DB insert
- Create `SolutionVideo` records with thumbnail URL
- Delete DB record and Cloudinary video with CDN invalidation

# Main Functions / Components / Classes

| Export | Purpose |
|--------|---------|
| `generateUploadSignature` | Signed params for `leetcode-solutions/{problemId}/{userId}_{timestamp}` |
| `saveVideoMetadata` | Verify resource, dedupe, create `SolutionVideo` |
| `deleteVideo` | `findOneAndDelete` by `problemId`, destroy Cloudinary asset |

# Internal Logic

### generateUploadSignature

1. Load `Problem` by `req.params.problemId`
2. `timestamp = round(now/1000)`
3. `publicId = leetcode-solutions/${problemId}/${userId}_${timestamp}`
4. `cloudinary.utils.api_sign_request(uploadParams, CLOUDINARY_API_SECRET)`
5. Return signature, keys, and `upload_url` for video upload API

### saveVideoMetadata

1. `cloudinary.api.resource(cloudinaryPublicId, { resource_type: 'video' })`
2. Check duplicate `(problemId, userId, cloudinaryPublicId)`
3. `thumbnailUrl = cloudinary.image(public_id, { resource_type: 'video' })`
4. `SolutionVideo.create` with duration from resource or body

### deleteVideo

1. `SolutionVideo.findOneAndDelete({ problemId })` — **not filtered by userId**
2. `cloudinary.uploader.destroy(publicId, { resource_type: 'video', invalidate: true })`

# Inputs and Outputs

| Handler | Input | Output |
|---------|-------|--------|
| `generateUploadSignature` | `problemId` param | JSON with signature, keys, URLs |
| `saveVideoMetadata` | body fields | `201` + video summary |
| `deleteVideo` | `problemId` param | success message |

# Dependencies

**npm:** `cloudinary`

**Internal:** `../models/problems`, `../models/solutionVideo`, `../utils/asyncHandler`

**Note:** `User` is imported but unused in current source.

# Used By

- [../routes/videoCreator.md](../routes/videoCreator.md)

# API Connections

| Service | Usage |
|---------|--------|
| Cloudinary | `utils.api_sign_request`, `api.resource`, `uploader.destroy`, `image` thumbnail |

# Database Connections

- `Problem` — existence check
- `SolutionVideo` — create/delete/find

# State/Context Dependencies

- `process.env.CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `req.result._id` for public_id path and metadata

# Related Files

- [../routes/videoCreator.md](../routes/videoCreator.md)
- [../database/solutionVideo.md](../database/solutionVideo.md)
- [../database/problems.md](../database/problems.md)

# Next Files To Read

1. [../database/solutionVideo.md](../database/solutionVideo.md)
2. Frontend `AdminUpload.jsx` (client upload flow)

# Common Risks / Notes

- API secret returned only for signing; `api_key` and `cloud_name` sent to client (expected for signed upload).
- Delete by `problemId` only may remove wrong video if multiple exist.
- `userId` in `deleteVideo` is read but not used in query.
- No authorization check that admin owns the problem beyond `adminMiddleware`.

# Last Reviewed: 2026-05-18
