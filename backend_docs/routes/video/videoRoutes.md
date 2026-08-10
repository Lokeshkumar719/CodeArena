# `backend/src/routes/video/videoRoutes.js`

**Layer:** Route  
**Documented Source File:** `backend/src/routes/video/videoRoutes.js`  
**Mounted at:** `/video` in `backend/src/index.js`  
**Purpose:** Admin-only routes for YouTube solution video management.  
**Last reviewed:** 2026-08-10

## Route Table

| Method | Path | Middleware | Handler |
|--------|------|------------|---------|
| POST | `/upload/:problemId` | `authMiddleware`, `adminMiddleware` | `uploadVideo` |
| PUT | `/update/:problemId` | `authMiddleware`, `adminMiddleware` | `updateVideo` |
| DELETE | `/delete/:problemId` | `authMiddleware`, `adminMiddleware` | `deleteVideo` |

## Dependencies

- [../../controllers/video/videoController.md](../../controllers/video/videoController.md)
- [../../middlewares/auth/authMiddleware.md](../../middlewares/auth/authMiddleware.md)
- [../../middlewares/auth/adminMiddleware.md](../../middlewares/auth/adminMiddleware.md)

## Used By

- [../../config/index.md](../../config/index.md)

## Last Reviewed: 2026-08-10