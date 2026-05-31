// services/problem.service.js
const mongoose   = require("mongoose");                                          // ADDED — was missing, breaks getSolvedProblemIds
const { Problem } = require("../../models/problem");
const Submission  = require("../../models/submission");
const { buildProblemQuery, buildPagination } = require("../../utils/problem/buildProblemQuery");

// Fields to EXCLUDE from listing — never send heavy data to the problemset page
const LISTING_PROJECTION = {
  hiddenTestCases:   0,
  referenceSolution: 0,
  startCode:         0,
  description:       0,
  inputFormat:       0,
  outputFormat:      0,
  constraints:       0,
  visibleTestCases:  0,
};

/**
 * Core service for GET /problems
 * Handles: search, filter, status, pagination, isSolved annotation
 */
async function listProblems(queryParams, userId) {
  // ── 1. Build filter + validate ──────────────────────────────────────────
  const { filter, errors } = buildProblemQuery(queryParams);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  // ── 2. Pagination ───────────────────────────────────────────────────────
  const { page, limit, skip } = buildPagination(queryParams);

  // ── 3. Status filter (solved / unsolved) ────────────────────────────────
  const status = queryParams.status?.toLowerCase();
  let solvedIds = [];                                                            // CHANGED — hoisted out; reused for isSolved annotation below

  if (status && ["solved", "unsolved"].includes(status)) {
    solvedIds = await getSolvedProblemIds(userId);

    if (status === "solved") {
      filter._id = { $in: solvedIds };
    } else {
      filter._id = { $nin: solvedIds };
    }
  }

  // ── 4. Query ────────────────────────────────────────────────────────────
  const [totalProblems, problems] = await Promise.all([
    Problem.countDocuments(filter),
    Problem.find(filter, LISTING_PROJECTION)
      .sort({ problemNo: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  // ── 5. Guard: page beyond range ─────────────────────────────────────────
  const totalPages = Math.ceil(totalProblems / limit);

  if (totalProblems > 0 && page > totalPages) {
    return {
      success: false,
      errors: [`Page ${page} does not exist. Total pages: ${totalPages}.`],
    };
  }

  // ── 6. isSolved annotation ───────────────────────────────────────────────
  // ADDED — frontend relies on problem.isSolved; no longer does a separate fetch
  //
  // status=solved   → every result is solved    → short-circuit to true
  // status=unsolved → every result is unsolved  → short-circuit to false
  // no status       → fetch solved IDs and check per problem
  let solvedSet = new Set();

  if (!status) {
    // Status filter wasn't applied — need solved IDs for annotation
    // Skip the DB call if there's no logged-in user (public / unauthenticated)
    if (userId) {
      const ids = await getSolvedProblemIds(userId);
      solvedSet = new Set(ids.map((id) => id.toString()));
    }
  }

  const annotated = problems.map((p) => ({
    ...p,
    isSolved:
      status === "solved"   ? true  :
      status === "unsolved" ? false :
      solvedSet.has(p._id.toString()),
  }));

  // ── 7. Return structured response ───────────────────────────────────────
  return {
    success: true,
    data: {
      pagination: {
        currentPage:  page,
        totalPages,
        totalProblems,
        hasNextPage:  page < totalPages,
        hasPrevPage:  page > 1,
        limit,
      },
      problems: annotated,                                                       // CHANGED — was: problems
    },
  };
}

/**
 * Returns an array of problem ObjectIds the user has solved at least once.
 * Extracted here so it can be independently cached with Redis later.
 */
async function getSolvedProblemIds(userId) {
  const accepted = await Submission.find(
    { userId, status: "accepted" },
    { problemId: 1, _id: 0 }
  ).lean();

  const uniqueIds = [...new Set(accepted.map((s) => s.problemId.toString()))];
  return uniqueIds.map((id) => new mongoose.Types.ObjectId(id));                // FIXED — mongoose now imported
}

module.exports = { listProblems };