# File Purpose

Business logic for DSA problem lifecycle: admin CRUD with Judge0-based reference-solution validation, paginated listing, user-facing reads, solved-problem tracking, and submission history per problem.

# Responsibilities

- Validate reference solutions against visible test cases before create/update
- Persist and update Problem documents
- Return problem payloads with optional SolutionVideo metadata
- Paginate all problems for homepage rendering
- Populate solved problems for authenticated users
- Query submission history for a specific problem

# Authentication Flow

All protected controllers depend on middleware-driven authentication and authorization.

## userMiddleware

Responsible for:
- JWT verification
- Redis blocklist validation
- Fetching authenticated user from database
- Attaching authenticated user document to:
  js   req.user   

## adminMiddleware

Responsible only for authorization:

js id="v4c0hj" req.user.role === "admin" 

Admin-only controllers:
- createProblem
- updateProblem
- deleteProblem
- getProblemByIdAdmin

require both:
js userMiddleware, adminMiddleware 

# Main Functions / Components / Classes

| Export | Purpose |
|--------|---------|
| createProblem | Judge0-validate each reference solution → Problem.create |
| updateProblem | Validate id + arrays → Judge0 → findByIdAndUpdate |
| deleteProblem | findById + findByIdAndDelete |
| getProblemByIdAdmin | Full admin fields + hidden tests + video |
| getProblemById | User view (no hidden tests) + video |
| getAllProblems | Paginated _id title difficulty tags |
| solvedProblems | User.populate('problemSolved') |
| submittedProblem | Submission.find({ userId, problemId }) |

All controllers are wrapped with asyncHandler.

# Internal Logic

## Reference Solution Validation (Create / Update)

For each:

js { language, completeCode } 

inside referenceSolution:

1. getLanguageById(language) maps platform language to Judge0 language_id
2. Batch submissions are created from visibleTestCases
3. submitBatch() sends submissions to Judge0
4. submitToken() polls Judge0 results
5. Each testcase result is validated:
   js    test.status_id === JUDGE0_STATUS.ACCEPTED    

Validation failure rejects problem creation/update.

### Important Runtime Note

userSubmission.js compares:

js test.status.id 

while this file uses:

js test.status_id 

Judge0 response shape may vary depending on requested fields and API response structure.

This inconsistency should be verified carefully during runtime testing.

# createProblem

- Validates every reference solution before persistence
- Stores authenticated admin as:
  js   problemCreator: req.user._id   
- Uses:
  js   Problem.create({     ...req.body,     problemCreator   })   
- Returns generic 400 response on Judge0 validation failure

### Note

problemCreater typo may still exist in request destructuring but is ignored.

# getProblemById vs getProblemByIdAdmin

| Field | User | Admin |
|-------|------|-------|
| hiddenTestCases | omitted | included |
| referenceSolution | included | included |

Both controllers optionally merge SolutionVideo metadata when available.

# getAllProblems

Defaults:
js page = 1 limit = 5 

Returns:
js {   problems,   currentPage,   totalPages,   totalProblems } 

### Behavior Note

Returns 404 when no problems exist.

Some APIs instead prefer:
js 200 + [] 

Frontend expectations should remain consistent with backend behavior.

# Inputs and Outputs

| Handler | Key Inputs | Response |
|---------|-------------|-----------|
| createProblem | Full problem body | 200 text or 400 |
| updateProblem | req.params.id, body | Updated problem |
| deleteProblem | Problem id | Success message |
| getProblemById* | Problem id | Problem object ± video |
| getAllProblems | page, limit | Paginated response |
| solvedProblems | req.user._id | Solved problem array |
| submittedProblem | problemId | Submission history |

# Dependencies

## Internal

- ../utils/problemUtility
- ../services/judge0Service
- ../constants/judgeStatus
- ../models/problems
- ../models/user
- ../models/submission
- ../models/solutionVideo
- ../utils/asyncHandler

## npm Packages

- mongoose

# Used By

- ../routes/problemCreator.md

# API Connections

Judge0 CE via:

- ../services/judge0Service.md

# Database Connections

## MongoDB Collections

### Problem
- create
- update
- delete
- pagination
- fetch by id

### SolutionVideo
- fetch associated editorial video metadata

### User
- populate solved problems

### Submission
- fetch submission history

# State / Context Dependencies

- req.user
- Judge0 service layer
- JUDGE0_STATUS constants

# Related Files

- ../routes/problemCreator.md
- ../database/problems.md
- ../services/judge0Service.md
- ../constants/judgeStatus.md

# Next Files To Read

1. ../database/problems.md
2. ../services/judge0Service.md

# Common Risks / Notes

- status_id vs status.id inconsistency with Judge0 response shape may cause incorrect validation logic.
- createProblem does not fully validate request body before Judge0 processing.
- No MongoDB transaction exists if Judge0 succeeds but DB write fails afterward.
- Generic "Error Occured" responses reduce debugging clarity.
- Empty-problem 404 behavior should remain consistent with frontend assumptions.

# Last Reviewed: 2026-05-18