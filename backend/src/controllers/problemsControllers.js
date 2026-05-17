const { getLanguageById } = require("../utils/problemUtility");
const { submitBatch, submitToken } = require("../services/judge0Service");
const { JUDGE0_STATUS } = require("../constants/judgeStatus");
const Problem = require("../models/problems");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");

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

  console.log("i am inside create problem");

  for (const { language, completeCode } of referenceSolution) {
    const languageId = getLanguageById(language);

    if (!languageId) {
      return res
        .status(400)
        .json({ error: `Unsupported language: ${language}` });
    }

    const submission = visibleTestCases.map((testCase) => ({
      source_code: completeCode,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output,
    }));

    console.log(submission);

    const submitResult = await submitBatch(submission);

    console.log(submitResult);

    const resultTokens = submitResult.map((result) => result.token);

    const testResult = await submitToken(resultTokens);

    console.log(testResult);

    for (const test of testResult) {
      if (test.status_id !== JUDGE0_STATUS.ACCEPTED) {
        return res.status(400).send("Error Occured");
      }
    }
  }

  console.log("creating problem");

  await Problem.create({
    ...req.body,
    problemCreator: req.result._id,
  });

  res.send("Problem Created Successfully");
});

const updateProblem = asyncHandler(async (req, res) => {
  console.log("i am inside update problem");

  const { id } = req.params;
  const { referenceSolution, visibleTestCases } = req.body;

  if (!id) {
    return res.status(400).json({
      error: "Problem id is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "Invalid problem id",
    });
  }

  if (!Array.isArray(referenceSolution)) {
    return res.status(400).json({
      error: "Reference solution is required",
    });
  }

  if (!Array.isArray(visibleTestCases)) {
    return res.status(400).json({
      error: "Visible testcases are required",
    });
  }

  const dsaProblem = await Problem.findById(id);

  if (!dsaProblem) {
    return res.status(404).json({
      error: "Problem not found",
    });
  }

  for (const { language, completeCode } of referenceSolution) {
    console.log("Reading reference solution");

    const languageId = getLanguageById(language);

    if (!languageId) {
      return res.status(400).json({
        error: `Unsupported language: ${language}`,
      });
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
        return res.status(400).json({
          error: `Reference solution failed for ${language}`,
        });
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

  res.status(200).json(newProblem);
});

const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: "Problem id is required",
    });
  }

  const problemToDelete = await Problem.findById(id);

  if (!problemToDelete) {
    return res.status(404).json({
      error: "Problem not found",
    });
  }

  await Problem.findByIdAndDelete(id);

  return res.status(200).send("problem deleted successfully");
});

const getProblemByIdAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    console.log("i am inside admin get id");

    return res.status(400).json({
      error: "Problem id is required",
    });
  }

  const reqdProblem = await Problem.findById(id).select(
    "_id title description difficulty tags visibleTestCases hiddenTestCases startCode referenceSolution",
  );

  if (!reqdProblem) {
    return res.status(404).json({
      error: "Problem not found",
    });
  }

  const videos = await SolutionVideo.findOne({ problemId: id });

  if (videos) {
    const responseData = {
      ...reqdProblem.toObject(),
      secureUrl: videos.secureUrl,
      thumbnailUrl: videos.thumbnailUrl,
      duration: videos.duration,
    };

    return res.status(200).send(responseData);
  }

  return res.status(200).send(reqdProblem);
});

const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: "Problem id is required",
    });
  }

  const reqdProblem = await Problem.findById(id).select(
    "_id title description difficulty tags visibleTestCases startCode referenceSolution",
  );

  if (!reqdProblem) {
    return res.status(404).json({
      error: "Problem not found",
    });
  }

  const videos = await SolutionVideo.findOne({ problemId: id });

  if (videos) {
    const responseData = {
      ...reqdProblem.toObject(),
      secureUrl: videos.secureUrl,
      thumbnailUrl: videos.thumbnailUrl,
      duration: videos.duration,
    };

    return res.status(200).send(responseData);
  }

  return res.status(200).send(reqdProblem);
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
    return res.status(404).json({
      error: "No problems found",
    });
  }

  return res.status(200).json({
    problems: allProblems,
    currentPage: page,
    totalPages: Math.ceil(totalProblems / limit),
    totalProblems,
  });
});

const solvedProblems = asyncHandler(async (req, res) => {
  const userId = req.result._id;

  const user = await User.findById(userId).populate({
    path: "problemSolved",
    select: "_id title difficulty tags",
  });

  res.status(200).send(user.problemSolved);
});

const submittedProblem = asyncHandler(async (req, res) => {
  const userId = req.result._id;

  const problemId = req.params.id;

  const ans = await Submission.find({ userId, problemId });

  if (ans.length == 0) {
    return res.status(200).json([]);
  }

  res.status(200).json(ans);
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
