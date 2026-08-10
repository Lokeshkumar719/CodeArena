# File Purpose

Simple email HTML templates used for sending verification and password reset emails.

**Documented Source Files:**
- `backend/src/services/auth/emailTemplates/resetPasswordEmailTemplate.js`
- `backend/src/services/auth/emailTemplates/verificationEmailTemplate.js`

# Responsibilities

- Generate dynamic HTML content for emails using provided link URLs.
- Provide a consistent, simple structure for transactional emails.

# Main Functions / Components / Classes

| Export | Description |
|--------|-------------|
| `resetPasswordEmailTemplate(url)` | Returns HTML for password reset containing the link. |
| `verificationEmailTemplate(url)` | Returns HTML for email verification containing the link. |

# Dependencies

None.

# Used By

- [../authController.md](../../controllers/auth/authController.md) - passes generated URLs and sends via `emailService`.

# Related Files

- [../emailService.md](./emailService.md)

# Last Reviewed: 2026-08-10
