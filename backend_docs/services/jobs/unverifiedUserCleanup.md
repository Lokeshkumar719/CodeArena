# `backend/src/services/jobs/unverifiedUserCleanup.js`

**Layer:** Background Job  
**Documented Source File:** `backend/src/services/jobs/unverifiedUserCleanup.js`  
**Purpose:** Cron job that deletes unverified user accounts older than 24 hours.  
**Last reviewed:** 2026-08-10

## Exported Function

### `startUnverifiedUserCleanup()`
- Schedules a `node-cron` job with expression `0 * * * *` (runs at minute 0 of every hour).
- On each tick, deletes all `User` documents where `isVerified === false` and `createdAt < (now − 24h)`.
- Logs deleted count to console when `> 0`.
- Errors are caught and logged (does not crash the process).

## Lifecycle

Called once during server startup in [../../config/index.md](../../config/index.md) (the main entry point), so the job runs for the lifetime of the process.

## Dependencies

- `node-cron` (npm)
- [../../models/user.md](../../models/user.md)
