# File Purpose

Synchronous validation helper for user registration (and admin registration, which reuses the same function). Throws `Error` with descriptive messages when validation fails.

# Responsibilities

- Ensure mandatory registration fields exist
- Validate email format and password strength
- Validate `firstName` length after trim

# Main Functions / Components / Classes

| Export | Actual function name in source |
|--------|-------------------------------|
| `validateUser` | `async function` — **no await inside**; exported as `module.exports = validateUser` |

Imported in controllers as:

```javascript
const validate = require("../utils/validate");
validate(req.body);
```

The import alias `validate` is valid because the export is the function itself.

# Internal Logic

1. `mandatoryField = ["firstName", "emailId", "password"]` — every key must exist on `data`
2. `validator.isEmail(data.emailId)`
3. `validator.isStrongPassword(data.password)` — default validator.js rules
4. Trim `firstName`; length must be 3–20

Throws:

- `"Some Field Missing"`
- `"Invalid Email"`
- `"Weak Password"`
- `"First name is required"`
- `"First name must be 3-20 characters long"`

# Inputs and Outputs

| Input | Output |
|-------|--------|
| Plain object `data` (req.body) | `undefined` on success |
| — | Throws `Error` on failure |

# Dependencies

**npm:** `validator`

# Used By

- [../auth/userAuthenticate.md](../auth/userAuthenticate.md) — `register`, `adminRegister`

# API Connections

None.

# Database Connections

None.

# State/Context Dependencies

None. Does not validate `lastName`, `age`, or role (role set in controller).

# Related Files

- [../auth/userAuthenticate.md](../auth/userAuthenticate.md)
- [../database/user.md](../database/user.md) — overlapping email/name rules

# Next Files To Read

1. [../auth/userAuthenticate.md](../auth/userAuthenticate.md)

# Common Risks / Notes

- Marked `async` but synchronous — unnecessary async.
- Login does **not** use this module (only checks presence of email/password in controller).
- `isStrongPassword` may reject passwords users expect to work — align with frontend Zod rules.
- Thrown errors become HTTP 500 via error middleware, not 400.

# Last Reviewed: 2026-05-18
