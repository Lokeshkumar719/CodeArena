# `backend/src/constants/reservedUsernames.js`

**Documented Source File:** `backend/src/constants/reservedUsernames.js`  
**Purpose:** Array of usernames that cannot be claimed by users during registration or profile update.  
**Last reviewed:** 2026-08-10

## Exported Value

An array of lowercase strings:

```
user, admin, root, system, moderator, staff, official, me, settings,
login, logout, register, signup, profile, api, support, help
```

## Used By

- [../services/profile/profileService.md](../services/profile/profileService.md) — checked during `updateProfileService()`
