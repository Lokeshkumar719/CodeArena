# `backend/src/constants/statusCodes.js`

**Documented Source File:** `backend/src/constants/statusCodes.js`  
**Purpose:** Named HTTP status code constants used across controllers, services, and middleware.  
**Last reviewed:** 2026-08-10

## Exported Object: `STATUS_CODES`

| Constant | Value | Category |
|----------|-------|----------|
| `OK` | `200` | Success |
| `CREATED` | `201` | Success |
| `BAD_REQUEST` | `400` | Client Error |
| `UNAUTHORIZED` | `401` | Client Error |
| `FORBIDDEN` | `403` | Client Error |
| `NOT_FOUND` | `404` | Client Error |
| `CONFLICT` | `409` | Client Error |
| `INTERNAL_SERVER_ERROR` | `500` | Server Error |
| `SERVICE_UNAVAILABLE` | `503` | Server Error |

## Usage

Imported by controllers, services, middleware, and validation utilities instead of using magic numbers.
