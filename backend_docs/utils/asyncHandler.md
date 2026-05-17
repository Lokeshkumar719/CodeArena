# File Purpose

Higher-order function that wraps async Express route handlers and forwards rejected promises to `next(err)` for the global error middleware.

# Responsibilities

- Eliminate try/catch in controllers
- Route exceptions to [../middleware/errorMiddleware.md](../middleware/errorMiddleware.md)

# Main Functions / Components / Classes

| Export | Signature |
|--------|-----------|
| `asyncHandler` | `(requestHandler) => (req, res, next) => void` |

# Internal Logic

```javascript
return (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch(next);
};
```

- Does not wrap synchronous throws inside `requestHandler` unless they occur after Promise resolution
- Does not call `next()` on success — handler must send response

# Inputs and Outputs

| Input | Output |
|-------|--------|
| Async function `(req, res, next)` | Express middleware |
| Rejected promise / throw in async fn | `next(err)` |

# Dependencies

None.

# Used By

- [../auth/userAuthenticate.md](../auth/userAuthenticate.md) — all handlers
- [../controllers/problemsControllers.md](../controllers/problemsControllers.md)
- [../controllers/userSubmission.md](../controllers/userSubmission.md)
- [../controllers/videoSection.md](../controllers/videoSection.md)
- [../middleware/userMiddleware.md](../middleware/userMiddleware.md)

# API Connections

None.

# Database Connections

None.

# State/Context Dependencies

Requires `errorMiddleware` registered on app.

# Related Files

- [../middleware/errorMiddleware.md](../middleware/errorMiddleware.md)

# Next Files To Read

1. [../middleware/errorMiddleware.md](../middleware/errorMiddleware.md)

# Common Risks / Notes

- [../middleware/adminMiddleware.md](../middleware/adminMiddleware.md) does **not** use this wrapper — inconsistent error handling.
- All thrown `Error` messages in auth become 500 responses.

# Last Reviewed: 2026-05-18
