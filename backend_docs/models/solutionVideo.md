# `backend/src/models/solutionVideo.js`

**Layer:** Model (Mongoose)  
**Documented Source File:** `backend/src/models/solutionVideo.js`  
**Purpose:** Schema and model for YouTube solution video links associated with coding problems.  
**Last reviewed:** 2026-08-10

## Schema: `videoSchema`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `problemId` | `ObjectId` (ref: `problem`) | required, unique | One video per problem |
| `userId` | `ObjectId` (ref: `user`) | required | Admin who uploaded the video |
| `youtubeUrl` | `String` | required, validated | Must be a valid `youtube.com` or `youtu.be` URL |
| `createdAt` | `Date` | auto | Timestamp |
| `updatedAt` | `Date` | auto | Timestamp |

## YouTube URL Validation

Custom validator checks that the URL hostname is one of:
- `www.youtube.com`
- `youtube.com`
- `youtu.be`

## Model Name

`mongoose.model("solutionVideo", videoSchema)`

## Dependencies

- `mongoose`

## Used By

- [../controllers/video/videoController.md](../controllers/video/videoController.md)
- [../controllers/problem/problemController.md](../controllers/problem/problemController.md)
- [../services/problem/attachVideoDetails.md](../services/problem/attachVideoDetails.md)
- [../services/problem/listProblems.md](../services/problem/listProblems.md)

## Last Reviewed: 2026-08-10
