# `backend/src/utils/asyncHandler.js`

**Layer:** Utility  
**Documented Source File:** `backend/src/utils/asyncHandler.js`  
**Purpose:** Higher-order function that wraps async Express route handlers and forwards rejected promises to `next(err)`.  
**Last reviewed:** 2026-08-10

## Exported Function

### `asyncHandler(requestHandler)`

```javascript
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};
```

- Eliminates the need for `try/catch` blocks in every controller.
- Forwards any rejected promise or thrown error to Express's `next()`, which routes it to the global [../middlewares/errorMiddleware.md](../middlewares/errorMiddleware.md).

## Used By

All controllers:
- [../controllers/auth/authController.md](../controllers/auth/authController.md)
- [../controllers/problem/problemController.md](../controllers/problem/problemController.md)
- [../controllers/submission/submissionController.md](../controllers/submission/submissionController.md)
- [../controllers/video/videoController.md](../controllers/video/videoController.md)
- [../controllers/profile/profileController.md](../controllers/profile/profileController.md)
- [../controllers/statsController.md](../controllers/statsController.md)
