# `backend/src/services/storage/`

**Layer:** Service  
**Documented Source Directory:** `backend/src/services/storage/`  
**Purpose:** Cloudflare R2 (S3-compatible) operations for hidden test-case ZIP archives.  
**Last reviewed:** 2026-08-10

## Files

| File | Exported Function | Description |
|------|-------------------|-------------|
| `uploadHiddenTestcasesZip.js` | `uploadHiddenTestcasesZip(fileBuffer, problemNo)` | Uploads a ZIP buffer to R2 under key `problem-<problemNo>.zip`. Returns `{ key }`. |
| `extractHiddenTestcasesFromR2.js` | `extractHiddenTestcasesFromR2(hiddenTestCasesZip)` | Downloads the ZIP from R2 using the stored `key`, then delegates to `extractHiddenTestcasesFromZip`. |
| `extractHiddenTestcasesFromZip.js` | `extractHiddenTestcasesFromZip(buffer)` | Parses a ZIP buffer (via `adm-zip`). Expects `<n>.in` / `<n>.out` file pairs. Returns `[{ input, output }]` sorted by test number. |
| `deleteHiddenTestcasesZip.js` | `deleteHiddenTestcasesZip(hiddenTestCasesZip)` | Deletes the ZIP from R2 using the stored `key`. No-ops if key is absent. |

## Workflow

```
Admin uploads ZIP → uploadHiddenTestcasesZip → R2 bucket
                                                   ↓
User submits code → executionService needs hidden tests
                                                   ↓
                    extractHiddenTestcasesFromR2 → downloads from R2
                                                   ↓
                    extractHiddenTestcasesFromZip → parses .in/.out pairs
```

## Dependencies

- [../../config/r2Client.md](../../config/r2Client.md) — S3Client instance
- [../../utils/ApiError.md](../../utils/ApiError.md)
- `@aws-sdk/client-s3` (npm) — `PutObjectCommand`, `GetObjectCommand`, `DeleteObjectCommand`
- `adm-zip` (npm) — ZIP parsing

## Environment Variables

| Variable | Description |
|----------|-------------|
| `R2_BUCKET_NAME` | Cloudflare R2 bucket name |

## Used By

- [../../controllers/problem/problemController.md](../../controllers/problem/problemController.md)
- [../execution/executionService.md](../execution/executionService.md)
