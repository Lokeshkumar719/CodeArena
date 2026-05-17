# File Purpose

Express global error-handling middleware (four-argument signature). Catches errors passed via `next(err)` from `asyncHandler`-wrapped controllers and returns a uniform JSON 500 response.

# Responsibilities

- Log error to `console.error`
- Respond with `{ success: false, message }` and HTTP 500
- Use `err.message` or fallback `'Internal Server Error'`

# Main Functions / Components / Classes

| Export | Signature |
|--------|-----------|
| `errorMiddleware` | `(err, req, res, next) => void` |

# Internal Logic

```javascript
console.error(err);
return res.status(500).json({
  success: false,
  message: err.message || 'Internal Server Error'
});
```

- Does not call `next(err)` after responding
- Does not map error types to 4xx status codes
- Does not handle Mongoose validation errors distinctly

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `err` from `next(err)` | `500` JSON |

Validation/auth errors thrown in controllers also become **500** unless caught and sent with `res.status` directly.

# Dependencies

None (pure Express handler).

# Used By

- [../config/index.md](../config/index.md) — registered last: `app.use(errorMiddleware)`

# API Connections

None.

# Database Connections

None.

# State/Context Dependencies

Must be registered after all routes and after middleware that forwards errors via `next(err)` ([../utils/asyncHandler.md](../utils/asyncHandler.md)).

# Related Files

- [../utils/asyncHandler.md](../utils/asyncHandler.md)
- [../auth/userAuthenticate.md](../auth/userAuthenticate.md) — throws `Error` for bad credentials

# Next Files To Read

1. [../utils/asyncHandler.md](../utils/asyncHandler.md)

# Common Risks / Notes

- Login/register invalid credentials throw `Error` → **500** instead of 401 (client may show "Internal Server Error").
- No stack trace in response (good for security); only console log.
- Does not handle 404 for unknown routes (Express default HTML).

# Last Reviewed: 2026-05-18
