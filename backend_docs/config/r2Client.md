# File Purpose

Preconfigured AWS S3 Client for connecting to Cloudflare R2 (or any S3-compatible object storage). Used for storing and retrieving hidden test cases in ZIP format.

**Documented Source File:** `backend/src/config/r2Client.js`

# Responsibilities

- Load R2 credentials and endpoint configuration from the environment.
- Expose a shared `S3Client` instance for object storage operations.

# Main Functions / Components / Classes

| Export | Type | Description |
|--------|------|-------------|
| `r2Client` | `S3Client` | Instantiated AWS S3 Client configured for R2 |

# Internal Logic

```javascript
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
```

# Inputs and Outputs

| Input | Description |
|-------|-------------|
| `process.env.R2_ENDPOINT` | R2 endpoint URL |
| `process.env.R2_ACCESS_KEY_ID` | R2 Access Key ID |
| `process.env.R2_SECRET_ACCESS_KEY` | R2 Secret Access Key |

| Output | Description |
|--------|-------------|
| `S3Client` instance | Used by storage services to Put, Get, and Delete object commands |

# Dependencies

**npm:** `dotenv`, `@aws-sdk/client-s3`

# Used By

- [../services/storage/storageServices.md](../services/storage/storageServices.md) — R2 upload, extraction, and deletion handlers

# API Connections

| External API | Base URL |
|--------------|----------|
| Cloudflare R2 | `process.env.R2_ENDPOINT` |

# Database Connections

None.

# State/Context Dependencies

- Environmental variables must be loaded before instantiation.

# Related Files

- [../services/storage/storageServices.md](../services/storage/storageServices.md)

# Next Files To Read

1. [../services/storage/storageServices.md](../services/storage/storageServices.md) — hidden test case ZIP operations

# Common Risks / Notes

- Does not validate credentials at boot time; failures surface during upload/download commands.

# Last Reviewed: 2026-08-10
