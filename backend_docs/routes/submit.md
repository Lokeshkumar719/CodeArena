# File Purpose

Express router responsible for code execution and code submission endpoints for coding problems.

Mounted at:

txt id="1msj3n" /submission 

inside index.js.

# Responsibilities

- Protect execution routes using authentication middleware
- Route code execution requests to submission controllers
- Separate:
  - visible testcase execution (run)
  - full testcase evaluation (submit)
- Pass problem ID parameters into controller layer

# Authentication Architecture

All submission routes require:

js id="jlwm4" userMiddleware 

## userMiddleware

Responsible for:
- JWT verification
- Redis token blocklist validation
- Fetching authenticated user document
- Attaching:
  js   req.user   

This authenticated user context is required for:
- submission ownership
- solve tracking
- submission history
- user-specific DB updates

# Main Functions / Components / Classes

| Route | Middleware | Handler |
|-------|------------|---------|
| POST /submit/:id | userMiddleware | submitCode |
| POST /run/:id | userMiddleware | runCode |

Exports:

js id="xjlwm" submitRouter 

# Internal Logic

This router intentionally contains no business logic.

All execution orchestration lives inside:

- ../controllers/userSubmission.md

## submit

Performs:
- visible + hidden testcase evaluation
- Submission persistence
- solved-problem updates
- Judge0 orchestration

## run

Performs:
- visible testcase execution only
- no DB submission persistence
- lightweight execution preview

# Route Parameters

## :id

Represents:

txt id="x4jlwm" Problem MongoDB ObjectId 

used for:
- testcase retrieval
- submission association
- solve tracking

# Inputs and Outputs

| Endpoint | Body | Response |
|----------|------|----------|
| POST /submission/submit/:id | { code, language } | Submission summary |
| POST /submission/run/:id | { code, language } | Judge0 testcase results + summary |

Typical response fields include:
- accepted
- runtime
- memory
- passedTestCases
- totalTestCases
- testCases
- error

# Supported Languages

Language values are mapped using:

- ../utils/problemUtility.md

Currently supported:
- cpp
- java
- javascript

# Dependencies

## Internal Modules

- ../controllers/userSubmission
- ../middlewares/userMiddleware

# Used By

## Backend

- ../config/index.md

## Frontend

- frontend/src/pages/ProblemPage.jsx

# API Connections

Indirect Judge0 integration through controller/service layer.

See:
- ../services/judge0Service.md
- ../docs/API_FLOW.md

# Database Connections

## Submit Flow

Uses:
- Problem
- Submission
- User.problemSolved

## Run Flow

Uses:
- Problem read operations only

# State / Context Dependencies

- req.user
- Judge0 service layer
- language mapping utilities

Authenticated user document is required for:
- userId
- submission ownership
- $addToSet solved-problem updates

# Related Files

- ../controllers/userSubmission.md
- ../services/judge0Service.md
- ../middleware/userMiddleware.md
- ../database/submission.md

# Next Files To Read

1. ../controllers/userSubmission.md
2. ../services/judge0Service.md

# Common Risks / Notes

- Judge0 polling currently happens during active HTTP request lifecycle and may increase response latency under load.
- No rate limiting currently exists for expensive Judge0 execution routes.
- Runtime performance depends on Judge0 API responsiveness.
- Long-running submissions may keep Node.js request workers occupied.

# Last Reviewed: 2026-05-18