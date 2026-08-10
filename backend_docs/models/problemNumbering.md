# Problem Numbering Models

**Layer:** Database (Mongoose)  
**Documented Source Files:** 
- `backend/src/models/counter.js`
- `backend/src/models/reusableProblemNo.js`
- `backend/src/utils/problem/getNextProblemNo.js`

**Last reviewed:** 2026-08-10

## Overview

Unlike standard applications that rely solely on MongoDB `ObjectId`s (`_id`) for primary keys, a coding platform requires sequential, human-readable integer IDs (e.g., Problem #1, #2). To achieve this reliably in a distributed environment without race conditions, CodeArena uses an atomic counter pattern combined with a recycling mechanism for deleted problems.

## `Counter` Model (`counter.js`)

A simple schema that tracks the highest assigned integer.

- `_id`: String (always `"problemNo"`).
- `seq`: Number (the current maximum ID).

When a new problem is created, Mongoose's `findOneAndUpdate` with `$inc: { seq: 1 }` is used to atomically increment and return the new number.

## `ReusableProblemNo` Model (`reusableProblemNo.js`)

When an admin deletes a problem (e.g., Problem #4), that number is now missing from the sequence. To prevent permanent gaps in the catalog, the deleted number is stored here.

- `value`: Number (the deleted problem number).

## `getNextProblemNo()` Utility

This utility (`backend/src/utils/problem/getNextProblemNo.js`) determines the ID for the next created problem:
1. It first queries `ReusableProblemNo.findOneAndDelete({}, { sort: { value: 1 } })`.
2. If a reusable number is found (e.g., the smallest deleted gap), it returns that immediately.
3. If no reusable numbers exist, it falls back to the `Counter` model, atomically incrementing and returning `seq`.

This ensures the problem catalog is always densely packed without gaps, even after deletions.
