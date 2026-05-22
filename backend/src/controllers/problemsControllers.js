const { getLanguageById } = require("../utils/problemUtility");
const { submitBatch, submitToken } = require("../services/judge0Service");
const { JUDGE0_STATUS } = require("../constants/judgeStatus");
const Problem = require("../models/problems");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const STATUS_CODES = require("../constants/statusCodes");
const ApiError = require("../utils/ApiError");

const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    problemCreater,
    referenceSolution,
  } = req.body;

  for (const { language, completeCode } of referenceSolution) {
    const languageId = getLanguageById(language);

    if (!languageId) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        `Unsupported language: ${language}`,
      );
    }

    const submission = visibleTestCases.map((testCase) => ({
      source_code: completeCode,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output,
    }));

    const submitResult = await submitBatch(submission);

    const resultTokens = submitResult.map((result) => result.token);

    const testResult = await submitToken(resultTokens);

    for (const test of testResult) {
      if (test.status_id !== JUDGE0_STATUS.ACCEPTED) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          `Reference solution failed for ${language}`,
        );
      }
    }
  }

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

  const { referenceSolution, visibleTestCases } = req.body;

  if (!id) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Problem id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid problem id");
  }

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

  const dsaProblem = await Problem.findById(id);

  if (!dsaProblem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Problem not found");
  }

  for (const { language, completeCode } of referenceSolution) {
    const languageId = getLanguageById(language);

    if (!languageId) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        `Unsupported language: ${language}`,
      );
    }

    const submission = visibleTestCases.map((testCase) => ({
      source_code: completeCode,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output,
    }));

    const submitResult = await submitBatch(submission);

    const resultTokens = submitResult.map((result) => result.token);

    const testResult = await submitToken(resultTokens);

    for (const test of testResult) {
      if (test.status_id !== JUDGE0_STATUS.ACCEPTED) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          `Reference solution failed for ${language}`,
        );
      }
    }
  }

  const newProblem = await Problem.findByIdAndUpdate(
    id,
    { ...req.body },
    {
      runValidators: true,
      new: true,
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

  if (!id) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Problem id is required");
  }

  const problemToDelete = await Problem.findById(id);

  if (!problemToDelete) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Problem not found");
  }

  await Problem.findByIdAndDelete(id);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Problem deleted successfully",
  });
});

const getProblemByIdAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Problem id is required");
  }

  const reqdProblem = await Problem.findById(id).select(
    "_id title description inputFormat outputFormat constraints difficulty tags visibleTestCases hiddenTestCases startCode referenceSolution",
  );

  if (!reqdProblem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Problem not found");
  }

  const videos = await SolutionVideo.findOne({
    problemId: id,
  });

  if (videos) {
    const responseData = {
      ...reqdProblem.toObject(),
      secureUrl: videos.secureUrl,
      thumbnailUrl: videos.thumbnailUrl,
      duration: videos.duration,
    };

    return res.status(STATUS_CODES.OK).json({
      success: true,
      data: responseData,
    });
  }

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: reqdProblem,
  });
});

const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Problem id is required");
  }

  const reqdProblem = await Problem.findById(id).select(
    "_id title description inputFormat outputFormat constraints difficulty tags visibleTestCases startCode referenceSolution",
  );

  if (!reqdProblem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Problem not found");
  }

  const videos = await SolutionVideo.findOne({
    problemId: id,
  });

  if (videos) {
    const responseData = {
      ...reqdProblem.toObject(),
      secureUrl: videos.secureUrl,
      thumbnailUrl: videos.thumbnailUrl,
      duration: videos.duration,
    };

    return res.status(STATUS_CODES.OK).json({
      success: true,
      data: responseData,
    });
  }

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: reqdProblem,
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

  const ans = await Submission.find({
    userId,
    problemId,
  });

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