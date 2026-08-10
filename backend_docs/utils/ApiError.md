# `backend/src/utils/ApiError.js`

**Layer:** Utility  
**Documented Source File:** `backend/src/utils/ApiError.js`  
**Purpose:** Custom error class for operational errors with HTTP status codes.  
**Last reviewed:** 2026-08-10

## Class: `ApiError extends Error`

### Constructor

```javascript
new ApiError(statusCode, message)
```

| Property | Description |
|----------|-------------|
| `statusCode` | HTTP status code (e.g., `400`, `401`, `404`) |
| `message` | Human-readable error message |
| `success` | Always `false` |

### Usage

Thrown by services and utilities; caught by [../middlewares/errorMiddleware.md](../middlewares/errorMiddleware.md) which formats the JSON error response.

```javascript
throw new ApiError(STATUS_CODES.NOT_FOUND, 'Problem not found');
```

## Used By

Virtually every service, controller, and validation utility in the backend.
