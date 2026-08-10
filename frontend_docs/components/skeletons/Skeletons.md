# Skeleton Components

**Source Directory:** `frontend/src/components/skeletons/`  
**Doc path:** `frontend_docs/components/skeletons/Skeletons.md`

# Overview

These are purely presentational components that display animated loading states (shimmering boxes) while data is being fetched. They improve perceived performance.

# Components

- `AdminCardSkeleton`
- `AdminUploadSkeleton`
- `LoadingProblem`
- `ProblemDescriptionSkeleton`
- `ProblemListSkeleton`
- `SubmissionHistorySkeleton`
- `TableSkeleton`
- `TableSkeletonvideo`
- `TestCasePanelSkeleton`

# Implementation Logic

They generally use the DaisyUI `skeleton` utility class (e.g., `className="skeleton h-4 w-20"`) combined with standard HTML structure (tables, divs, lists) that mimics the final rendered content.
