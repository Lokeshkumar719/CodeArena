const { getLanguageById } = require("../../utils/validation/validateUserRegistration");
const { submitBatch, submitToken } = require("../execution/judge0Service");
const { JUDGE0_STATUS } = require("../../constants/judgeStatus");
const STATUS_CODES = require("../../constants/statusCodes");
const ApiError = require("../../utils/ApiError");

const validateReferenceSolutions = async (referenceSolution, testCases) => {
  for (const { language, completeCode } of referenceSolution) {
    const languageId = getLanguageById(language);
    if (!languageId) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        `Unsupported language: ${language}`,
      );
    }
    // prepare Judge0 submissions
    const submission = testCases.map((testCase) => ({
      source_code: completeCode,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output,
    }));
    // send submissions to Judge0
    const submitResult = await submitBatch(submission);
    // extract Judge0 tokens
    const resultTokens = submitResult.map((result) => result.token);
    // fetch execution results
    const testResult = await submitToken(resultTokens);
    // validate all testcases passed
    for (const test of testResult) {
      if (test.status_id !== JUDGE0_STATUS.ACCEPTED) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          `Reference solution failed for ${language}`,
        );
      }
    }
  }
};

module.exports = validateReferenceSolutions;
