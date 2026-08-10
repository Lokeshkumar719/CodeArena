# `backend/src/services/auth/emailService.js`

**Layer:** Service  
**Documented Source File:** `backend/src/services/auth/emailService.js`  
**Purpose:** Sends transactional emails (password reset, email verification) via the Resend API.  
**Last reviewed:** 2026-08-10

## Exported Function

### `sendEmail({ to, subject, html })`
- Uses the [Resend](https://resend.com/) SDK to deliver transactional emails.
- Reads `RESEND_API_KEY` and `EMAIL_FROM` from environment variables.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Sender email address (e.g. `noreply@codearena.dev`) |

## Dependencies

- `resend` (npm package)

## Used By

- [authService.md](./authService.md) — password reset and email verification flows
