# File Purpose

Maps platform language strings to Judge0 `language_id` integers using shared constants.

# Responsibilities

- Provide `getLanguageById(lang)` for controllers and submission flow
- Normalize language key with `.toLowerCase()`

# Main Functions / Components / Classes

| Export | Description |
|--------|-------------|
| `getLanguageById(lang)` | Returns `LANGUAGE_IDS[lang.toLowerCase()]` or `undefined` |

# Internal Logic

```javascript
const { LANGUAGE_IDS } = require('../constants/judge0');
return LANGUAGE_IDS[lang.toLowerCase()];
```

Supported keys (from constants): `cpp` → 54, `java` → 62, `javascript` → 63.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `"cpp"`, `"CPP"`, etc. | `54` |
| Unknown language | `undefined` → callers return 400 Unsupported |

# Dependencies

**Internal:** [../constants/judge0.md](../constants/judge0.md)

# Used By

- [../controllers/problemsControllers.md](../controllers/problemsControllers.md)
- [../controllers/userSubmission.md](../controllers/userSubmission.md)

# API Connections

Indirect — ids must match Judge0 CE language table on RapidAPI.

# Database Connections

None.

# State/Context Dependencies

None.

# Related Files

- [../constants/judge0.md](../constants/judge0.md)
- [../services/judge0Service.md](../services/judge0Service.md)

# Next Files To Read

1. [../constants/judge0.md](../constants/judge0.md)

# Common Risks / Notes

- No validation that `lang` is a string before `.toLowerCase()` — non-string throws.
- Adding a language requires updating constants, submission schema enum, and frontend editor.

# Last Reviewed: 2026-05-18
