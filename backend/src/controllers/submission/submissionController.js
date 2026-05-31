const Submission = require('../../models/submission');
const { Problem } = require('../../models/problem');

const { getLanguageById } = require('../../utils/judge/judge0Utils');

const asyncHandler = require('../../utils/asyncHandler');
const getExecutionLimits = require('../../utils/judge/getExecutionLimits');
const ApiError = require('../../utils/ApiError');
const validateSubmissionInput = require('../../utils/validation/validateSubmissionInput');

const executeCode = require('../../services/execution/executionService');

const STATUS_CODES = require('../../constants/statusCodes');
const SUBMISSION_STATUS = require('../../constants/submissionStatus');

const submitCode = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const problemId = req.params.id;

  const { code, language } = req.body;

  validateSubmissionInput(userId, problemId, code, language);

  const languageId = getLanguageById(language);

  if (!languageId) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Unsupported language",
    );
  }

  const problem = await Problem.findById(problemId);

  if (!problem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Problem not found");
  }

  // combine visible + hidden testcases
  const allTestcases = [
    ...problem.visibleTestCases,
    ...problem.hiddenTestCases,
  ];

  // create initial pending submission
  const submittedResult = await Submission.create({
    userId,
    problemId,
    code,
    language,
    testCasesPassed: 0,
    status: SUBMISSION_STATUS.PENDING,
    testCasesTotal: allTestcases.length,
  });

  // execute code against all testcases
  const {
    testCasesPassed,
    runtime,
    memory,
    status,
    errorMessage,
  } = await executeCode(
    allTestcases,
    code,
    languageId,
    getExecutionLimits(problem),
  );

  // update submission result
  submittedResult.status = status;

  submittedResult.testCasesPassed = testCasesPassed;

  submittedResult.runtime = runtime;

  submittedResult.memory = memory;

  submittedResult.errorMessage = errorMessage;

  await submittedResult.save();

  // add solved problem only if accepted
  if (status === SUBMISSION_STATUS.ACCEPTED) {
    await req.user.updateOne({
      $addToSet: {
        problemSolved: problemId,
      },
    });
  }

  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    data: {
      accepted: status === SUBMISSION_STATUS.ACCEPTED,
      status,
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

  validateSubmissionInput(userId, problemId, code, language);

  const problem = await Problem.findById(problemId);

  if (!problem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Problem not found");
  }

  const languageId = getLanguageById(language);

  if (!languageId) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Unsupported language",
    );
  }

  // execute code only on visible testcases
  const {
    testResult,
    testCasesPassed,
    runtime,
    memory,
    status,
    errorMessage,
  } = await executeCode(
    problem.visibleTestCases,
    code,
    languageId,
    getExecutionLimits(problem),
    true,
  );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: {
      accepted: status === SUBMISSION_STATUS.ACCEPTED,
      status,
      testCases: testResult,
      runtime,
      memory,
      error: errorMessage,
      passedTestCases: testCasesPassed,
    },
  });
});

module.exports = {
  submitCode,
  runCode,
};
