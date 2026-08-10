# Admin Form Components

**Source Directory:** `frontend/src/components/admin/forms/`  
**Doc path:** `frontend_docs/components/admin/forms/AdminFormComponents.md`

# Overview

These components are sections of the larger `CreateProblem` and `UpdateProblem` forms. They use `react-hook-form` contexts passed from the parent to manage their respective fields.

# Components

| Component | File | Responsibilities |
|-----------|------|------------------|
| `BasicInformationSection` | `BasicInformationSection.jsx` | Form fields for Title, Description, Input/Output Format, Constraints, Time/Memory limits, Difficulty, and Tags. |
| `CodeTemplatesSection` | `CodeTemplatesSection.jsx` | Form fields for `startCode` and `referenceSolution` across all supported languages. |
| `VisibleTestCasesSection` | `VisibleTestCasesSection.jsx` | Manages the dynamic array of visible test cases (input, output, explanation) using `useFieldArray`. |
| `TestCaseBlock` | `TestCaseBlock.jsx` | Renders the UI for a single test case input group (used by `VisibleTestCasesSection`). |
| `HiddenTestCasesSection` | `HiddenTestCasesSection.jsx` | File input for uploading a ZIP file of hidden test cases (input/output text files). |

# Dependencies

- `react-hook-form`
- `../../../styles/admin/updateProblemStyles`
