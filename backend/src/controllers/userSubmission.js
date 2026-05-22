const Problem = require("../models/problems");
const Submission = require("../models/submission");
const { getLanguageById } = require("../utils/problemUtility");
const asyncHandler = require("../utils/asyncHandler");
const executeCode = require("../services/executionService");
const STATUS_CODES = require("../constants/statusCodes");
const ApiError = require("../utils/ApiError");

const submitCode = asyncHandler(async (req, res) => {
  // middleware already attaches authenticated user
  const userId = req.user._id;

  const problemId = req.params.id;

  const { code, language } = req.body;

  if (!userId || !problemId || !code || !language) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Some fields are missing");
  }

  const languageId = getLanguageById(language);

  if (!languageId) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Unsupported language");
  }

  const problem = await Problem.findById(problemId);

  if (!problem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Problem not found");
  }

  // combine both visible and hidden test cases
  const allTestcases = [
    ...problem.visibleTestCases,
    ...problem.hiddenTestCases,
  ];

  const submittedResult = await Submission.create({
    userId,
    problemId,
    code,
    language,
    testCasesPassed: 0,
    status: "pending",
    testCasesTotal: allTestcases.length,
  });

  const { testCasesPassed, runtime, memory, status, errorMessage } =
    await executeCode(allTestcases, code, languageId);

  submittedResult.status = status;

  submittedResult.testCasesPassed = testCasesPassed;

  submittedResult.runtime = runtime;

  submittedResult.memory = memory;

  submittedResult.errorMessage = errorMessage;

  await submittedResult.save();

  // add solved problem only if accepted
  if (status === "accepted") {
    await req.user.updateOne({
      $addToSet: {
        problemSolved: problemId,
      },
    });
  }

  const accepted = status === "accepted";

  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    data: {
      accepted,
      error: errorMessage,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory,
    },
  });
});

const runCode = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const problemId = req.params.id;

  const { code, language } = req.body;

  if (!userId || !problemId || !code || !language) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Some fields are missing");
  }

  const problem = await Problem.findById(problemId);

  if (!problem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Problem not found");
  }

  const languageId = getLanguageById(language);

  if (!languageId) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, "Unsupported language");
  }

  const { testResult, testCasesPassed, runtime, memory, status, errorMessage } =
    await executeCode(problem.visibleTestCases, code, languageId, true);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: {
      accepted: status === "accepted",
      testCases: testResult,
      runtime,
      memory,
      error: errorMessage,
      passedTestCases: testCasesPassed,
    },
  });
});

module.exports = { submitCode, runCode };