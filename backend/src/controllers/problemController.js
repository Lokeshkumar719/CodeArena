const asyncHandler = require('../utils/asyncHandler');
const STATUS_CODES = require('../constants/statusCodes');
const problemService = require('../services/problem/problemService');

const createProblem = asyncHandler(async (req, res) => {
  await problemService.createProblemService(req.body, req.file?.buffer, req.user._id);

  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: 'Problem created successfully',
  });
});

const updateProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const newProblem = await problemService.updateProblemService(id, req.body, req.file?.buffer);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Problem updated successfully',
    data: newProblem,
  });
});

const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await problemService.deleteProblemService(id);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Problem deleted successfully',
  });
});

const getProblemByIdAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const responseData = await problemService.getProblemByIdAdminService(id);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: responseData,
  });
});

const getProblemBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const responseData = await problemService.getProblemBySlugService(slug);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: responseData,
  });
});

const getProblems = asyncHandler(async (req, res) => {
  const userId = req.user?._id ?? null;
  const data = await problemService.getProblemsService(req.query, userId);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    ...data,
  });
});

const solvedProblems = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const data = await problemService.solvedProblemsService(userId);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data,
  });
});

const submittedProblem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const problemId = req.params.id;
  const data = await problemService.submittedProblemService(userId, problemId);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data,
  });
});

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemBySlug,
  getProblems,
  solvedProblems,
  submittedProblem,
  getProblemByIdAdmin,
};
