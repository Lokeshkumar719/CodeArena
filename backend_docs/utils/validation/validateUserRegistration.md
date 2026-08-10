# `backend/src/utils/validation/validateUserRegistration.js`

**Layer:** Utility  
**Documented Source File:** `backend/src/utils/validation/validateUserRegistration.js`  
**Purpose:** Validates user registration payloads.  
**Last reviewed:** 2026-08-10

## Exported Function

### `validateUser(data)`
Validates the registration request body. Throws `ApiError(400)` on failure.

### Validation Rules

1. **Mandatory fields**: `username`, `emailId`, `password` must all be present.
2. **Email**: Must pass `validator.isEmail()`.
3. **Password strength**: Must satisfy `validator.isStrongPassword()` with minLength 8, requiring uppercase, lowercase, number, and symbol.
4. **Username**: After `.trim()`, must be 3–20 characters long.

### Error Messages

| Condition | Message |
|-----------|---------|
| Missing field | `'Some Field Missing'` |
| Invalid email | `'Invalid Email'` |
| Weak password | `'Password must contain uppercase, lowercase, number, special character and be at least 8 characters long'` |
| Missing username | `'username is required'` |
| Username length | `'username must be 3-20 characters long'` |

## Dependencies

- `validator` (npm)
- [../ApiError.md](../ApiError.md)
- [../../constants/statusCodes.md](../../constants/statusCodes.md)

## Used By

- [../../services/auth/authService.md](../../services/auth/authService.md) — during `registerUser()`
