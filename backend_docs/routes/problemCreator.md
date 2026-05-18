# File Purpose

Express router responsible for problem CRUD operations, problem retrieval, solved-problem tracking, and submission-history routes.

Mounted at:

txt id="l6yv17" /problem 

inside index.js.

# Responsibilities

- Bind admin-only problem management routes
- Bind authenticated user-facing problem routes
- Apply middleware-based authentication and authorization
- Route requests to appropriate controller handlers

# Authentication Architecture

Authentication and authorization are intentionally separated.

## userMiddleware

Responsible for:
- JWT verification
- Redis token blocklist validation
- Fetching authenticated user document
- Attaching:
  js   req.user   

## adminMiddleware

Responsible only for authorization:

js id="j43e6s" req.user.role === "admin" 

## Middleware Order

Admin routes always require:

js id="z4b9j9" userMiddleware, adminMiddleware 

because:
- adminMiddleware depends on req.user
- req.user is attached by userMiddleware

# Main Functions / Components / Classes

| Route | Middleware | Controller |
|-------|------------|------------|
| POST /create | userMiddleware, adminMiddleware | createProblem |
| PUT /update/:id | userMiddleware, adminMiddleware | updateProblem |
| DELETE /delete/:id | userMiddleware, adminMiddleware | deleteProblem |
| GET /admin/problemById/:id | userMiddleware, adminMiddleware | getProblemByIdAdmin |
| GET /problemById/:id | userMiddleware | getProblemById |
| GET /getAllProblems | userMiddleware | getAllProblems |
| GET /problemSolvedByUser | userMiddleware | solvedProblems |
| GET /problemSubmmision/:id | userMiddleware | submittedProblem |

Exports:

js id="wdr7c4" problemRouter 

# Internal Logic

## Admin Routes

Admin controllers:
- validate reference solutions through Judge0
- persist/update/delete Problem documents
- access hidden testcases
- manage problem metadata

Authentication and authorization happen before controller execution.

## User Routes

Authenticated users can:
- fetch problem details
- view paginated problem lists
- access solved-problem history
- view submission history

getProblemById intentionally omits:

js id="t6jbf7" hiddenTestCases 

from user-facing responses.

# Route Behavior Notes

## problemSubmmision

The route:

txt id="jlwmx" /problemSubmmision/:id 

uses:
- problem ID
- NOT submission ID

Current route contains a typo:

txt id="jlwm1" Submmision 

Clients must currently match the exact existing route name.

# Inputs and Outputs

| Endpoint | Query / Params | Notes |
|----------|----------------|------|
| GET /getAllProblems | page, limit | Paginated response |
| GET /problemById/:id | Problem ID | Includes optional video metadata |
| GET /problemSolvedByUser | — | Uses authenticated user context |
| GET /problemSubmmision/:id | Problem ID | Returns submission history |

# Dependencies

## Internal Modules

- ../controllers/problemsControllers
- ../middlewares/adminMiddleware
- ../middlewares/userMiddleware

# Used By

## Backend

- ../config/index.md

## Frontend Components

- Homepage.jsx
- ProblemPage.jsx
- SubmissionHistory.jsx
- Admin dashboard/problem-management components

# API Connections

Indirectly connects to Judge0 through controller/service layer.

See:
- ../docs/API_FLOW.md

# Database Connections

Handled through controllers:

- Problem
- Submission
- SolutionVideo
- User

# State / Context Dependencies

- req.user
- Judge0 service layer
- authentication middleware chain

Admin write operations use:

js id="jlwm2" req.user._id 

for:
- problemCreator
- ownership metadata
- audit tracking

# Related Files

- ../controllers/problemsControllers.md
- ../middleware/adminMiddleware.md
- ../middleware/userMiddleware.md
- ../database/problems.md
- ../database/submission.md

# Next Files To Read

1. ../controllers/problemsControllers.md
2. ../database/problems.md

# Common Risks / Notes

- Route typo:
  txt   problemSubmmision   
  should ideally become:
  txt   problemSubmission   
  in future refactors.

- Middleware ordering is important:
  js   userMiddleware,   adminMiddleware   

- Admin controllers depend on req.user populated by authentication middleware.

- Some route names are not fully REST-style yet and may be improved later for cleaner API conventions.

# Last Reviewed: 2026-05-18