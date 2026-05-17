# File Purpose

Mongoose schema and model for editorial solution videos stored on Cloudinary, linked to a problem and uploading admin user.

# Responsibilities

- Store Cloudinary `public_id`, secure URL, thumbnail, duration
- Enforce unique `cloudinaryPublicId`
- Reference `problemId` and `userId`

# Main Functions / Components / Classes

| Symbol | Description |
|--------|-------------|
| `videoSchema` | Schema |
| `SolutionVideo` | `mongoose.model("solutionVideo", videoSchema)` |

### Fields

| Field | Notes |
|-------|-------|
| `problemId` | ObjectId ref `'problem'` (lowercase; model is `Problem`) |
| `userId` | ObjectId ref `'user'` |
| `cloudinaryPublicId` | unique, required |
| `secureUrl` | required |
| `thumbnailUrl` | optional |
| `duration` | Number, required |
| timestamps | enabled |

# Internal Logic

- No indexes beyond unique on `cloudinaryPublicId`
- Controllers query `findOne({ problemId })` for attach to problem responses (first match)

# Inputs and Outputs

| Operation | Caller |
|-----------|--------|
| `create` | `saveVideoMetadata` |
| `findOne` | problem getters, duplicate check |
| `findOneAndDelete` | `deleteVideo` |

# Dependencies

**npm:** `mongoose`

# Used By

- [../controllers/videoSection.md](../controllers/videoSection.md)
- [../controllers/problemsControllers.md](../controllers/problemsControllers.md)

# API Connections

Metadata mirrors Cloudinary assets; no direct DB link to Cloudinary beyond stored URLs/ids.

# Database Connections

**MongoDB collection:** `solutionvideos` (default for model `solutionVideo`)

# State/Context Dependencies

- Ref `'problem'` may not populate correctly against `Problem` model — verify if populate is used (currently lean queries by id only)

# Related Files

- [../controllers/videoSection.md](../controllers/videoSection.md)
- [problems.md](./problems.md)

# Next Files To Read

1. [../controllers/videoSection.md](../controllers/videoSection.md)

# Common Risks / Notes

- One video per problem assumed in several flows but schema allows multiple (different `userId` / `public_id`).
- No soft-delete; Cloudinary destroy is synchronous with DB delete in controller.

# Last Reviewed: 2026-05-18
