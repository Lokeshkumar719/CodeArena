# File Purpose

Controller for running user code against visible test cases and submitting against full test suites (visible + hidden), persisting results and updating solve progress.

# Responsibilities

- Validate request body (`code`, `language`) and problem existence
- Map languages to Judge0 IDs
- Orchestrate Judge0 batch submit + poll
- Persist submission records (submit only)
- Update `User.problemSolved` on full accept
- Aggregate runtime, memory, pass count, status

# Main Functions / Components / Classes

| Export | Behavior |
|--------|----------|
| `submitCode` | All test cases → `Submission.create` → Judge0 → update doc → maybe `$addToSet problemSolved` |
| `runCode` | Visible tests only → Judge0 → JSON response, no submission row |

# Internal Logic

### Shared evaluation loop

After `submitToken` returns:

```text
status = "accepted"
for each test in testResult:
  if test.status.id !== JUDGE0_STATUS.ACCEPTED:
    status = COMPILE_ERROR ? "error" : "wrong"
    errorMessage = test.stderr
    break
  else increment testCasesPassed, sum runtime, max memory
```

### submitCode

1. `allTestcases = visible + hidden`
2. Create `Submission` with `status: "pending"`, `testCasesTotal: allTestcases.length`
3. Run Judge0 on all cases
4. Update submission fields: `status`, `testCasesPassed`, `runtime`, `memory`, `errorMessage`
5. If `status === "accepted"`: `req.result.updateOne({ $addToSet: { problemSolved: problemId } })`
6. Response: `{ accepted, error, totalTestCases, passedTestCases, runtime, memory }`

### runCode

- Maps only `problem.visibleTestCases`
- Returns raw `testCases: testResult` plus summary fields
- No `Submission` document

# Inputs and Outputs

| Handler | Params/Body | Response `201` |
|---------|-------------|----------------|
| `submitCode` | `:id` problemId, `{ code, language }` | Pass/fail summary |
| `runCode` | same | Includes full `testCases` array from Judge0 |

Missing fields → `400` `{ success: false, message }`.

# Dependencies

**Internal:** `../models/problems`, `../models/submission`, `../utils/problemUtility`, `../services/judge0Service`, `../utils/asyncHandler`, `../constants/judgeStatus`

# Used By

- [../routes/submit.md](../routes/submit.md)

# API Connections

Judge0 via [../services/judge0Service.md](../services/judge0Service.md).

# Database Connections

- `Problem.findById`
- `Submission.create` / `save` (submit)
- `req.result.updateOne` on User (mongoose document method)

# State/Context Dependencies

- `req.result._id` and full user doc for `$addToSet`
- `language` enum in schema: `cpp`, `java`, `javascript`

# Related Files

- [../routes/submit.md](../routes/submit.md)
- [../database/submission.md](../database/submission.md)
- [../services/judge0Service.md](../services/judge0Service.md)
- [../constants/judgeStatus.md](../constants/judgeStatus.md)

# Next Files To Read

1. [../services/judge0Service.md](../services/judge0Service.md)
2. [../database/submission.md](../database/submission.md)

# Common Risks / Notes

- Assigns `submittedResult.errorMessage` but **submission schema has no `errorMessage` field** — value may be stripped under strict schema.
- First failing test stops evaluation; remaining cases not run (by design in loop).
- `req.result.updateOne` requires middleware to attach Mongoose document (not plain object).
- Long Judge0 polling blocks HTTP worker thread.

# Last Reviewed: 2026-05-18
