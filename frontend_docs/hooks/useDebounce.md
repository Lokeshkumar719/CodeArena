# `frontend/src/hooks/useDebounce.jsx`

**Source:** `frontend/src/hooks/useDebounce.jsx`  
**Doc path:** `frontend_docs/hooks/useDebounce.md`

# File Purpose

A custom React hook that delays the update of a value until a specified time has passed since the last change.

# Responsibilities

- Receive a `value` and a `delay` (in milliseconds).
- Return a debounced version of the value.
- Clear the timeout on unmount or if the value/delay changes before the timeout completes.

# Internal Logic

Uses `useState` to store the debounced value and `useEffect` with `setTimeout` to update it. The cleanup function of the `useEffect` calls `clearTimeout`, ensuring that rapid changes to the input value only result in one update after the user stops typing.

# Used By

- [`DeleteProblem.jsx`](../components/admin/DeleteProblem.md)
- [`ManageVideoSolutions.jsx`](../components/admin/ManageVideoSolutions.md)
- [`UpdateProblemList.jsx`](../components/admin/UpdateProblemList.md)
- [`Homepage.jsx`](../pages/Homepage.md)

(Used to debounce the text search input for problems, preventing excessive API calls).
