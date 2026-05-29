# `backend/src/services/executionService.js`

**Layer:** Service  
**Path:** `backend/src/services/executionService.js`  
**Purpose:** Orchestrates code execution flows (Run and Submit).  
**Last reviewed:** 2026-05-29

## Overview

The `executionService` bridges the gap between the HTTP controller (`userSubmission`) and the raw Judge0 API (`judge0Service`). It handles fetching the problem, formatting test cases, making base64 conversions, enforcing execution limits, and tracking submission history.

## Exported Functions

### `executeRun(problemId, language, code)`
Used for the "Run" button.
1. Validates the problem exists.
2. Formats only the `visibleTestCases`.
3. Calls `judge0Service.submitBatch`.
4. Polls for results.
5. Returns parsed results.

### `executeSubmit(userId, problemId, language, code)`
Used for the "Submit" button.
1. Validates the problem exists.
2. Checks user execution limits via `utils/getExecutionLimits.js` (e.g., maximum code length, valid language).
3. Creates a `Submission` document in MongoDB with `status: pending`.
4. Formats both `visibleTestCases` and `hiddenTestCases`.
5. Calls `judge0Service.submitBatch` and polls.
6. Evaluates results: If any test fails, the status is set to that failure (e.g., `wrong answer`). If all pass, status is `accepted`.
7. Updates the `Submission` document with runtime, memory, and status.
8. If `accepted`, updates the `User` document's `problemSolved` array via `$addToSet`.

## Data Transformation

Test cases from the database (`input`, `output`) are transformed into Judge0 payload objects:
```javascript
{
  source_code: base64Encode(code),
  language_id: languageId,
  stdin: base64Encode(testCase.input),
  expected_output: base64Encode(testCase.output)
}
```

After Judge0 returns the results, the service uses `getSubmissionResult` to map Judge0 internal status IDs (e.g., `3`) to application status strings (`accepted`).
