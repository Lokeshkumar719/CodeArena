const { getLanguageById } = require('../../utils/judge/judge0Utils');
const getExecutionLimits = require('../../utils/judge/getExecutionLimits');
const ApiError = require('../../utils/ApiError');
const extractHiddenTestcasesFromR2 = require('../../services/storage/extractHiddenTestcasesFromR2');
const executeCode = require('../../services/execution/executionService');
const STATUS_CODES = require('../../constants/statusCodes');
const SUBMISSION_STATUS = require('../../constants/submissionStatus');

const problemRepository = require('../../repositories/problemRepository');
const submissionRepository = require('../../repositories/submissionRepository');
const userRepository = require('../../repositories/userRepository');

const submitCodeService = async (userId, problemId, code, language) => {
  const languageId = getLanguageById(language);
  if (!languageId) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Unsupported language');
  }

  const problem = await problemRepository.findProblemById(problemId);
  if (!problem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Problem not found');
  }

  const hiddenTestCases = await extractHiddenTestcasesFromR2(problem.hiddenTestCasesZip);
  const allTestcases = [...problem.visibleTestCases, ...hiddenTestCases];

  const submittedResult = await submissionRepository.createSubmission({
    userId,
    problemId,
    code,
    language,
    testCasesPassed: 0,
    status: SUBMISSION_STATUS.PENDING,
    testCasesTotal: allTestcases.length,
  });

  const { testCasesPassed, runtime, memory, status, errorMessage } = await executeCode(
    allTestcases,
    code,
    languageId,
    getExecutionLimits(problem)
  );

  submittedResult.status = status;
  submittedResult.testCasesPassed = testCasesPassed;
  submittedResult.runtime = runtime;
  submittedResult.memory = memory;
  submittedResult.errorMessage = errorMessage;

  await submissionRepository.saveSubmission(submittedResult);

  if (status === SUBMISSION_STATUS.ACCEPTED) {
    const user = await userRepository.findUserById(userId);
    if (user) {
      await user.updateOne({
        $addToSet: {
          problemSolved: problemId,
        },
      });
    }
  }

  return {
    accepted: status === SUBMISSION_STATUS.ACCEPTED,
    status,
    error: errorMessage,
    totalTestCases: submittedResult.testCasesTotal,
    passedTestCases: testCasesPassed,
    runtime,
    memory,
  };
};

const runCodeService = async (problemId, code, language) => {
  const problem = await problemRepository.findProblemById(problemId);
  if (!problem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Problem not found');
  }

  const languageId = getLanguageById(language);
  if (!languageId) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Unsupported language');
  }

  const { testResult, testCasesPassed, runtime, memory, status, errorMessage } = await executeCode(
    problem.visibleTestCases,
    code,
    languageId,
    getExecutionLimits(problem),
    true
  );

  return {
    accepted: status === SUBMISSION_STATUS.ACCEPTED,
    status,
    testCases: testResult,
    runtime,
    memory,
    error: errorMessage,
    passedTestCases: testCasesPassed,
  };
};

module.exports = {
  submitCodeService,
  runCodeService,
};
