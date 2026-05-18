# File Purpose

Express router responsible for admin editorial-video workflows including:
- signed Cloudinary upload generation
- video metadata persistence
- editorial video deletion

Mounted at:

txt id="jlwm2" /video 

inside index.js.

# Responsibilities

- Restrict all routes to authenticated admin users
- Route upload/signature requests to controller layer
- Route video metadata persistence requests
- Route editorial video deletion requests
- Maintain separation between routing and business logic

# Authentication Architecture

All routes require:

js id="zjlwm" userMiddleware, adminMiddleware 

## userMiddleware

Responsible for:
- JWT verification
- Redis token blocklist validation
- Fetching authenticated user document
- Attaching:
  js   req.user   

## adminMiddleware

Responsible only for authorization:

js id="8jlwm" req.user.role === "admin" 

Only authenticated admins can:
- upload editorial videos
- save video metadata
- delete editorial videos

# Main Functions / Components / Classes

| Route | Middleware | Handler |
|-------|------------|---------|
| GET /create/:problemId | userMiddleware, adminMiddleware | generateUploadSignature |
| POST /save | userMiddleware, adminMiddleware | saveVideoMetadata |
| DELETE /delete/:problemId | userMiddleware, adminMiddleware | deleteVideo |

Exports:

js id="jlwm4" videoRouter 

# Internal Logic

This router intentionally contains no business logic.

All upload orchestration lives inside:

- ../controllers/videoSection.md

# Upload Workflow

## Step 1 — Generate Signed Upload Parameters

Frontend requests:

txt id="jlwm5" GET /video/create/:problemId 

Backend:
- validates problem existence
- generates signed Cloudinary upload parameters
- returns upload metadata

## Step 2 — Direct Browser Upload

Frontend uploads video directly to Cloudinary.

This avoids:
- backend file buffering
- large server uploads
- unnecessary backend bandwidth usage

## Step 3 — Save Metadata

Frontend sends uploaded video metadata to:

txt id="jlwm6" POST /video/save 

Backend:
- verifies uploaded Cloudinary resource
- creates SolutionVideo document
- stores thumbnail/video metadata

## Step 4 — Optional Delete

Admins may remove editorial videos through:

txt id="jlwm7" DELETE /video/delete/:problemId 

# Inputs and Outputs

| Endpoint | Input | Output |
|----------|-------|--------|
| GET /video/create/:problemId | problemId param | Signature + upload metadata |
| POST /video/save | Video metadata body | Created video summary |
| DELETE /video/delete/:problemId | problemId param | Success message |

Typical upload response includes:
- signature
- timestamp
- public_id
- api_key
- cloud_name
- upload_url

# Dependencies

## Internal Modules

- ../controllers/videoSection
- ../middlewares/userMiddleware
- ../middlewares/adminMiddleware

# Used By

## Backend

- ../config/index.md

## Frontend

- frontend/src/components/AdminUpload.jsx

# API Connections

## Cloudinary

Indirect integration through controller layer:
- signed uploads
- resource verification
- asset deletion
- thumbnail generation

Judge0 is NOT used in this flow.

# Database Connections

Handled through controller layer:

## MongoDB Collections

- SolutionVideo
- Problem

# State / Context Dependencies

- req.user
- Cloudinary environment variables
- authentication middleware chain

Authenticated admin ID is used for:
- upload path generation
- metadata ownership
- duplicate validation

# Related Files

- ../controllers/videoSection.md
- ../database/solutionVideo.md
- ../middleware/adminMiddleware.md

# Next Files To Read

1. ../controllers/videoSection.md
2. ../database/solutionVideo.md

# Common Risks / Notes

- deleteVideo currently deletes using only:
  js   problemId   
  and may delete unintended records if multiple videos exist.

- Direct browser uploads depend on Cloudinary API availability.

- Admin routes rely on correct middleware ordering:
  js   userMiddleware,   adminMiddleware   

- saveVideoMetadata duplicate validation includes:
  js   userId + cloudinaryPublicId   

- User model import may still exist unused inside controller source.

# Last Reviewed: 2026-05-18