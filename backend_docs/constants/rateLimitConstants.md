# `backend/src/constants/rateLimitConstants.js`

**Documented Source File:** `backend/src/constants/rateLimitConstants.js`  
**Purpose:** Rate-limiting parameters consumed by [../middlewares/rateLimitMiddleware.md](../middlewares/rateLimitMiddleware.md).  
**Last reviewed:** 2026-08-10

## Fixed-Window Limits (Auth routes)

| Constant | Value | Description |
|----------|-------|-------------|
| `LOGIN_LIMIT` | `10` | Max login attempts per window |
| `LOGIN_DURATION` | `900` (15 min) | Window duration in seconds |
| `REGISTER_LIMIT` | `10` | Max registration attempts per window |
| `REGISTER_DURATION` | `900` (15 min) | Window duration in seconds |
| `CHANGE_PASSWORD_LIMIT` | `5` | Max password-change attempts per window |
| `CHANGE_PASSWORD_DURATION` | `900` (15 min) | Window duration in seconds |

## Token-Bucket Limits (Execution routes)

| Constant | Value | Description |
|----------|-------|-------------|
| `RUN_LIMIT` | `3` | Max burst tokens for "Run" |
| `RUN_REFILL_RATE_PER_SEC` | `4/60 ≈ 0.0667` | Tokens refilled per second |
| `SUBMIT_LIMIT` | `3` | Max burst tokens for "Submit" |
| `SUBMIT_REFILL_RATE_PER_SEC` | `2/60 ≈ 0.0333` | Tokens refilled per second |

## Used By

- [../middlewares/rateLimitMiddleware.md](../middlewares/rateLimitMiddleware.md)
