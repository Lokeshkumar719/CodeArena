const mongoose = require('mongoose');

const problemRepository = require('../../repositories/problemRepository');
const submissionRepository = require('../../repositories/submissionRepository');
const solutionVideoRepository = require('../../repositories/solutionVideoRepository');

const { buildProblemQuery, buildPagination } = require('../../utils/problem/buildProblemQuery');

const LISTING_PROJECTION = {
  hiddenTestCases: 0,
  referenceSolution: 0,
  startCode: 0,
  description: 0,
  inputFormat: 0,
  outputFormat: 0,
  constraints: 0,
  visibleTestCases: 0,
};

async function listProblems(queryParams, userId) {
  const { filter, errors } = buildProblemQuery(queryParams);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  const { page, limit, skip } = buildPagination(queryParams);

  const status = queryParams.status?.toLowerCase();
  let solvedIds = [];

  if (status && ['solved', 'unsolved'].includes(status)) {
    solvedIds = await getSolvedProblemIds(userId);

    if (status === 'solved') {
      filter._id = { $in: solvedIds };
    } else {
      filter._id = { $nin: solvedIds };
    }
  }

  const [totalProblems, problems, videos] = await Promise.all([
    problemRepository.countProblems(filter),

    problemRepository.findProblems(filter, LISTING_PROJECTION, { problemNo: 1 }, skip, limit),

    solutionVideoRepository.findAllVideoProblemIds(),
  ]);

  const totalPages = Math.ceil(totalProblems / limit);

  if (totalProblems > 0 && page > totalPages) {
    return {
      success: false,
      errors: [`Page ${page} does not exist. Total pages: ${totalPages}.`],
    };
  }

  let solvedSet = new Set();

  if (!status) {
    if (userId) {
      const ids = await getSolvedProblemIds(userId);
      solvedSet = new Set(ids.map((id) => id.toString()));
    }
  }

  const videoSet = new Set(videos.map((video) => video.problemId.toString()));

  const annotated = problems.map((p) => ({
    ...p,

    isSolved:
      status === 'solved' ? true : status === 'unsolved' ? false : solvedSet.has(p._id.toString()),

    hasVideo: videoSet.has(p._id.toString()),
  }));

  return {
    success: true,
    data: {
      pagination: {
        currentPage: page,
        totalPages,
        totalProblems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },

      problems: annotated,
    },
  };
}

async function getSolvedProblemIds(userId) {
  return await submissionRepository.findAcceptedProblemIdsForUser(userId);
}

module.exports = {
  listProblems,
};
