# `backend/src/middlewares/rateLimitMiddleware.js`

**Layer:** Middleware  
**Documented Source File:** `backend/src/middlewares/rateLimitMiddleware.js`  
**Purpose:** Provides Redis-backed rate limiting for auth and execution routes.  
**Last reviewed:** 2026-08-10

## Overview

This module exports multiple Express middlewares that restrict how frequently an IP address or a user can hit specific endpoints. It uses the `rate-limiter-flexible` library for simple "Fixed Window" limits and custom Redis Lua scripts for high-performance "Token Bucket" limits.

## Exported Limiters

| Export | Type | Key | Limits | Routes protected |
|--------|------|-----|--------|------------------|
| `limitLogin` | Fixed Window | IP | 10 per 15m | `/user/login`, `/user/forgot-password` |
| `limitRegister` | Fixed Window | IP | 10 per 15m | `/user/register` |
| `limitChangePassword`| Fixed Window | `req.user._id`| 5 per 15m | `/user/change-password` |
| `limitRunCode` | Token Bucket | `req.user._id`| burst 3, refill rate | `/submission/run/:id` |
| `limitSubmitCode` | Token Bucket | `req.user._id`| burst 3, refill rate | `/submission/submit/:id`, `/problem/create\|update` |

## Token Bucket Algorithm (Lua Script)

For `/submission/run` and `/submission/submit`, standard fixed windows don't offer good UX. Users want to submit multiple times quickly, but shouldn't spam the Judge0 API indefinitely.

A custom Redis Lua script (`TOKEN_BUCKET_LUA`) runs atomically:
1. Calculates time elapsed since the `last_refill`.
2. Refills tokens based on elapsed time.
3. Caps tokens at the maximum burst limit (3).
4. If tokens > 0, deducts 1 and allows request.
5. If tokens == 0, rejects request and calculates `retryAfterSeconds`.

## HTTP Headers Added

When a request passes:
- `X-RateLimit-Limit`: The total allowed tokens/requests.
- `X-RateLimit-Remaining`: How many are left.

When a request is blocked (429):
- `Retry-After`: Seconds until the user can try again.
- Response body: `{ success: false, message: "...", retryAfterSeconds: N }`

## Fail-Open Strategy

If Redis is disconnected or throws an error during the rate limit check, the middleware logs the error and calls `next()`. This ensures the application stays online even if the rate limiter goes down.

## Dependencies

- [../config/redis.md](../config/redis.md) — `redisClient`
- `rate-limiter-flexible` — NPM library
