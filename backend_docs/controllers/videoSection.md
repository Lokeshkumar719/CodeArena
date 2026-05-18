# File Purpose

Controller for Cloudinary-backed solution video uploads, metadata persistence, and deletion for coding problem editorial videos.

# Responsibilities

- Configure Cloudinary SDK using environment variables
- Verify problem existence before generating upload credentials
- Generate signed upload parameters for direct browser uploads
- Validate uploaded Cloudinary resources before DB persistence
- Create SolutionVideo metadata records
- Delete Cloudinary resources with CDN invalidation
- Manage thumbnail URL generation for uploaded videos

# Authentication Flow

All routes using this controller require:

js id="4ycvfh" userMiddleware, adminMiddleware 

## userMiddleware

Responsible for:
- JWT verification
- Redis token blocklist validation
- Fetching authenticated user document
- Attaching:
  js   req.user   

## adminMiddleware

Responsible only for authorization:

js id="yr7l2x" req.user.role === "admin" 

Only authenticated admins can:
- upload editorial videos
- save metadata
- delete videos

# Main Functions / Components / Classes

| Export | Purpose |
|--------|---------|
| generateUploadSignature | Generate signed Cloudinary upload parameters |
| saveVideoMetadata | Verify uploaded resource and persist metadata |
| deleteVideo | Delete DB record + Cloudinary video resource |

All controllers are wrapped with asyncHandler.

# Internal Logic

# generateUploadSignature

## Workflow

1. Verify problem exists using:
   js    Problem.findById(problemId)    

2. Generate timestamp:
   js    Math.round(Date.now() / 1000)    

3. Create Cloudinary public ID:
   txt    leetcode-solutions/{problemId}/{userId}_{timestamp}    

4. Generate signed upload parameters:
   js    cloudinary.utils.api_sign_request()    

5. Return:
   - signature
   - api_key
   - cloud_name
   - timestamp
   - public_id
   - upload URL

## Upload Strategy

Frontend uploads directly to Cloudinary using signed upload parameters instead of proxying large video files through backend servers.

# saveVideoMetadata

## Workflow

1. Verify uploaded Cloudinary resource exists:
   js    cloudinary.api.resource()    

2. Check duplicate entries using:
   js    problemId,    userId,    cloudinaryPublicId    

3. Generate thumbnail URL:
   js    cloudinary.image(public_id,{      resource_type:"video"    })    

4. Create SolutionVideo document

5. Store:
   - public ID
   - secure video URL
   - thumbnail URL
   - duration
   - uploader info

# deleteVideo

## Workflow

1. Delete associated DB record:
   js    SolutionVideo.findOneAndDelete({ problemId })    

2. Delete Cloudinary asset:
   js    cloudinary.uploader.destroy()    

3. CDN invalidation enabled:
   js    invalidate: true    

# Inputs and Outputs

| Handler | Input | Output |
|---------|-------|--------|
| generateUploadSignature | problemId param | Signature + upload metadata |
| saveVideoMetadata | Video metadata body | Created video response |
| deleteVideo | problemId param | Success message |

# Dependencies

## npm Packages

- cloudinary

## Internal Modules

- ../models/problems
- ../models/solutionVideo
- ../utils/asyncHandler

### Note

User model import currently appears unused.

# Used By

- ../routes/videoCreator.md

# API Connections

## Cloudinary

Used APIs:

| API | Purpose |
|-----|---------|
| utils.api_sign_request | Generate signed upload parameters |
| api.resource | Verify uploaded resource |
| uploader.destroy | Delete uploaded video |
| image | Generate thumbnail URL |

# Database Connections

## MongoDB Collections

### Problem
- validate problem existence

### SolutionVideo
- create metadata
- delete metadata
- fetch duplicates

# State / Context Dependencies

- process.env.CLOUDINARY_CLOUD_NAME
- process.env.CLOUDINARY_API_KEY
- process.env.CLOUDINARY_API_SECRET
- req.user._id

Authenticated user ID is used for:
- upload path generation
- uploader tracking
- duplicate validation

# Related Files

- ../routes/videoCreator.md
- ../database/solutionVideo.md
- ../database/problems.md

# Next Files To Read

1. ../database/solutionVideo.md
2. Frontend upload flow (AdminUpload.jsx)

# Common Risks / Notes

- api_key and cloud_name are intentionally exposed to frontend for signed uploads.
- deleteVideo currently deletes by problemId only and may remove unintended records if multiple videos exist.
- userId may be read during deletion flow but not used inside DB query.
- Authorization currently depends only on adminMiddleware; ownership-based authorization is not enforced.
- Cloudinary upload verification depends on external API availability.

# Last Reviewed: 2026-05-18