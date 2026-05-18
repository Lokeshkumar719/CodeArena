# File Purpose

Controller for running user code against visible test cases and submitting code against complete test suites (visible + hidden test cases), while persisting submission history and updating solved-problem progress.

# Responsibilities

- Validate request body (code, language) and problem existence
- Map platform languages to Judge0 language IDs
- Orchestrate Judge0 batch submission + polling workflow
- Persist submission records during full submissions
- Update User.problemSolved on accepted submissions
- Aggregate runtime, memory usage, testcase counts, and final status

# Authentication Flow

All routes using this controller require:

js userMiddleware 

which:
- verifies JWT
- validates Redis token blocklist
- fetches authenticated user document
- attaches:
  js   req.user   

This controller depends on authenticated user context for:
- submission ownership
- solved-problem tracking
- user-specific submission history

# Main Functions / Components / Classes

| Export | Behavior |
|--------|----------|
| submitCode | Full testcase evaluation + Submission.create + solved-problem update |
| runCode | Visible testcase execution only, no DB persistence |

All controllers are wrapped using asyncHandler.

# Internal Logic

## Shared Evaluation Loop

After Judge0 polling returns results:

txt status = "accepted"  for each test in testResult:   if test.status.id !== JUDGE0_STATUS.ACCEPTED:     status = COMPILE_ERROR ? "error" : "wrong"     errorMessage = test.stderr     break   else:     increment passed count     accumulate runtime     track peak memory 

The loop:
- aggregates testcase statistics
- determines final submission status
- exits immediately on first failing testcase

# submitCode

## Workflow

1. Merge:
   js    visibleTestCases + hiddenTestCases    

2. Create initial Submission document:
   js    status: "pending"    

3. Execute all testcases using Judge0

4. Poll Judge0 until execution completes

5. Update submission document with:
   - status
   - passed testcase count
   - runtime
   - memory
   - error information

6. On full acceptance:
   js    req.user.updateOne({      $addToSet: {        problemSolved: problemId      }    })    

7. Return summarized execution response

## Response Shape

js id="eok6p7" {   accepted,   error,   totalTestCases,   passedTestCases,   runtime,   memory } 

# runCode

## Behavior

- Executes only:
  js   problem.visibleTestCases   

- Returns:
  - raw Judge0 testcase results
  - aggregated runtime/memory data
  - pass/fail summary

- Does NOT create Submission documents

## Response Includes

js id="8mvrv3" {   testCases,   runtime,   memory,   accepted,   passedTestCases } 

# Inputs and Outputs

| Handler | Params / Body | Response |
|---------|----------------|----------|
| submitCode | problemId, { code, language } | Submission summary |
| runCode | problemId, { code, language } | Judge0 testcase results + summary |

Missing or invalid fields return:

js id="c1mk1u" {   success: false,   message } 

with 400 status.

# Dependencies

## Internal

- ../models/problems
- ../models/submission
- ../utils/problemUtility
- ../services/judge0Service
- ../utils/asyncHandler
- ../constants/judgeStatus

# Used By

- ../routes/submit.md

# API Connections

Judge0 CE integration via:

- ../services/judge0Service.md

# Database Connections

## MongoDB Collections

### Problem
- fetch testcase data
- validate problem existence

### Submission
- create pending submission
- update final execution results

### User
- update solved-problem progress using:
  js   $addToSet   

# State / Context Dependencies

- req.user
- Judge0 execution service
- platform language mappings
- JUDGE0_STATUS constants

Supported language values currently include:
- cpp
- java
- javascript

# Related Files

- ../routes/submit.md
- ../database/submission.md
- ../services/judge0Service.md
- ../constants/judgeStatus.md

# Next Files To Read

1. ../services/judge0Service.md
2. ../database/submission.md

# Common Risks / Notes

- submittedResult.errorMessage may not persist if Submission schema does not define an errorMessage field.
- Evaluation loop stops on first failing testcase by design.
- req.user.updateOne() requires middleware to attach a full Mongoose document rather than a plain object.
- Long Judge0 polling can keep HTTP requests open for extended durations.
- Runtime aggregation logic depends on Judge0 response consistency.

# Last Reviewed: 2026-05-18