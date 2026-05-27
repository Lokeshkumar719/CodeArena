const Problem = require("../models/problems");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo");
const asyncHandler = require("../utils/asyncHandler");
const STATUS_CODES = require("../constants/statusCodes");
const ApiError = require("../utils/ApiError");
const validateReferenceSolutions = require("../services/problem/validateReferenceSolutions");
const validateObjectId = require("../utils/validateObjectId");
const attachVideoDetails = require("../services/problem/attachVideoDetails");

const createProblem = asyncHandler(async (req, res) => {
  const { referenceSolution, visibleTestCases, hiddenTestCases } = req.body;

  if (!Array.isArray(referenceSolution)) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Reference solution is required",
    );
  }

  if (!Array.isArray(visibleTestCases)) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Visible testcases are required",
    );
  }

  if (!Array.isArray(hiddenTestCases)) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Hidden testcases are required",
    );
  }

  // validate reference solutions against all testcases
  const allTestCases = [...visibleTestCases, ...hiddenTestCases];

  await validateReferenceSolutions(referenceSolution, allTestCases);

  await Problem.create({
    ...req.body,
    problemCreator: req.user._id,
  });

  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: "Problem created successfully",
  });
});

const updateProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateObjectId(id);

  const { referenceSolution, visibleTestCases, hiddenTestCases } = req.body;

  if (!Array.isArray(referenceSolution)) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Reference solution is required",
    );
  }

  if (!Array.isArray(visibleTestCases)) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Visible testcases are required",
    );
  }

  if (!Array.isArray(hiddenTestCases)) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Hidden testcases are required",
    );
  }

  const dsaProblem = await Problem.findById(id);

  if (!dsaProblem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Problem not found");
  }

  // validate reference solutions against all testcases
  const allTestCases = [...visibleTestCases, ...hiddenTestCases];

  await validateReferenceSolutions(referenceSolution, allTestCases);

  const newProblem = await Problem.findByIdAndUpdate(
    id,
    { ...req.body },
    {
      runValidators: true,
      returnDocument: "after",
    },
  );


  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Problem updated successfully",
    data: newProblem,
  });
});

const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateObjectId(id);

  const problemToDelete = await Problem.findById(id);

  if (!problemToDelete) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Problem not found");
  }

  // delete related submissions
  await Submission.deleteMany({
    problemId: id,
  });

  // delete related solution videos
  await SolutionVideo.deleteMany({
    problemId: id,
  });

  // remove problem from solved list
  await User.updateMany(
    {},
    {
      $pull: {
        problemSolved: id,
      },
    },
  );

  // delete actual problem
  await Problem.findByIdAndDelete(id);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Problem deleted successfully",
  });
});

const getProblemByIdAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateObjectId(id);

  const reqdProblem = await Problem.findById(id).select(
    "_id title description inputFormat outputFormat constraints timeLimit memoryLimit difficulty tags visibleTestCases hiddenTestCases startCode referenceSolution",
  );

  if (!reqdProblem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Problem not found");
  }

  const responseData = await attachVideoDetails(reqdProblem, id);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: responseData,
  });
});

const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateObjectId(id);

  const reqdProblem = await Problem.findById(id).select(
    "_id title description inputFormat outputFormat constraints timeLimit memoryLimit difficulty tags visibleTestCases startCode referenceSolution",
  );

  if (!reqdProblem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Problem not found");
  }

  const responseData = await attachVideoDetails(reqdProblem, id);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: responseData,
  });
});

const getAllProblems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  const limit = parseInt(req.query.limit) || 5;

  const skip = (page - 1) * limit;

  const totalProblems = await Problem.countDocuments();

  const allProblems = await Problem.find({})
    .select("_id title difficulty tags")
    .skip(skip)
    .limit(limit);

  if (!allProblems || allProblems.length === 0) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "No problems found");
  }

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: {
      problems: allProblems,
      currentPage: page,
      totalPages: Math.ceil(totalProblems / limit),
      totalProblems,
    },
  });
});

const solvedProblems = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate({
    path: "problemSolved",
    select: "_id title difficulty tags",
  });
  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: user.problemSolved,
  });
});

const submittedProblem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const problemId = req.params.id;
  validateObjectId(problemId);
  const ans = await Submission.find({
    userId,
    problemId,
  }).sort({ createdAt: -1 });
  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: ans,
  });
});

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getProblemByIdAdmin,
  getAllProblems,
  solvedProblems,
  submittedProblem,
};