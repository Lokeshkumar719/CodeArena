# File Purpose

Multer middleware configuration for handling test case ZIP file uploads in memory.

**Documented Source File:** `backend/src/middlewares/uploadZipMiddleware.js`

# Responsibilities

- Configure Multer memory storage (buffers upload directly in RAM instead of writing temporary disk files)
- Restrict uploaded file size to `MAX_ZIP_SIZE` (100MB)
- Filter uploads to allow only `.zip` files

# Main Functions / Components / Classes

| Export | Type | Description |
|--------|------|-------------|
| `upload` | `Multer` instance | Single file uploader middleware configured for field `'testcaseZip'` |

# Dependencies

**npm:** `multer`

**Internal:**
- [../constants/storage.md](../constants/storage.md) — `MAX_ZIP_SIZE`
- [../utils/ApiError.md](../utils/ApiError.md)

# Used By

- [../routes/problem/problemRoutes.md](../routes/problem/problemRoutes.md) — attached to problem creation/update routes

# Related Files

- [../services/storage/storageServices.md](../services/storage/storageServices.md)

# Last Reviewed: 2026-08-10
