# `backend/src/services/execution/executionService.js`

**Layer:** Service  
**Documented Source File:** `backend/src/services/execution/executionService.js`  
**Purpose:** Executes user code against test cases via Judge0 batch submissions.  
**Last reviewed:** 2026-08-10

## Overview

The `executionService` is the core execution engine. It receives prepared test cases and code from the submission controller, batches them into Judge0 submissions, polls for results, and aggregates the final verdict.

## Exported Function

### `executeCode(testcases, code, languageId, executionLimits, includeTestResult = false)`

The module exports this single function as `module.exports = executeCode`.

**Parameters:**
- `testcases` — Array of `{ input, output }` objects
- `code` — User's source code string
- `languageId` — Judge0 numeric language ID
- `executionLimits` — `{ cpu_time_limit, wall_time_limit, memory_limit }` from `getExecutionLimits`
- `includeTestResult` — If `true`, includes raw Judge0 test results in response (used for "Run" mode)

**Flow:**
1. Maps each testcase into a Judge0 submission object (with execution limits spread in).
2. Batches submissions in groups of `MAX_BATCH_SIZE` (15).
3. For each batch: calls `submitBatch()` → extracts tokens → calls `submitToken()` to poll.
4. Iterates results: on first non-accepted status, breaks with that verdict.
5. Tracks `testCasesPassed`, max `runtime`, and max `memory` across accepted tests.

**Returns:** `{ testResult?, testCasesPassed, runtime, memory, status, errorMessage }`

## Dependencies

- [judge0Service.md](./judge0Service.md) — `submitBatch`, `submitToken`
- [../../constants/judgeStatus.md](../../constants/judgeStatus.md) — `JUDGE0_STATUS`
- [../../constants/judge0.md](../../constants/judge0.md) — `MAX_BATCH_SIZE`
- [../../utils/judge/judgeUtils.md](../../utils/judge/judgeUtils.md) — `getSubmissionResult`
