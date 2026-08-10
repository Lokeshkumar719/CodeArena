# `backend/src/utils/judge/judge0Utils.js`

**Layer:** Utility  
**Documented Source File:** `backend/src/utils/judge/judge0Utils.js`  
**Purpose:** Maps platform language strings to Judge0 `language_id` integers.  
**Last reviewed:** 2026-08-10

## Exported Function

### `getLanguageById(lang)`
- Returns `LANGUAGE_IDS[lang.toLowerCase()]` from the constants map.
- Returns `undefined` for unsupported languages (callers handle this as a 400 error).

## Supported Languages

| Key | Judge0 ID |
|-----|-----------|
| `cpp` | `54` |
| `java` | `62` |
| `javascript` | `63` |

(See [../../constants/judge0.md](../../constants/judge0.md) for the full mapping.)

## Dependencies

- [../../constants/judge0.md](../../constants/judge0.md)

## Used By

- [../../services/execution/executionService.md](../../services/execution/executionService.md)
- [../../services/problem/validateReferenceSolutions.md](../../services/problem/validateReferenceSolutions.md)
