# `frontend/src/utils/errorHandler.js`

**Source:** `frontend/src/utils/errorHandler.js`  
**Doc path:** `frontend_docs/utils/errorHandler.md`

# File Purpose

Provides a centralized utility for extracting user-friendly error messages from API responses.

# Responsibilities

- Export a `getErrorMessage` function.
- Handle various error structures (Axios response data, standard Error objects, or string fallbacks).

# Internal Logic

```javascript
export const getErrorMessage = (error, defaultMessage = 'An error occurred') => {
  return error.response?.data?.message || error.message || defaultMessage;
};
```

# Used By

- `Admin` forms (Create/Update/Delete).
- Problem solver panels.
