const { submitBatch, submitToken } = require("./judge0Service");
const { JUDGE0_STATUS } = require("../constants/judgeStatus");
const getSubmissionResult = require("../utils/getSubmissionResult");

const executeCode = async (
  testcases,
  code,
  languageId,
  executionLimits,
  includeTestResult = false,
) => {
const submissions=testcases.map((testcase)=>({
  source_code:code,
  language_id:languageId,
  stdin:testcase.input,
  expected_output:testcase.output,
  ...executionLimits
}));

  const submitResult = await submitBatch(submissions);
  const resultTokens = submitResult.map((value) => value.token);
  const testResult = await submitToken(resultTokens);

  let testCasesPassed = 0;
  let runtime = 0;
  let memory = 0;
  let status = "accepted";
  let errorMessage = null;

  for (const test of testResult) {
    if (test.status.id !== JUDGE0_STATUS.ACCEPTED) {
      const result = getSubmissionResult(test);

      status = result.status;
      errorMessage = result.errorMessage;

      break;
    }
    testCasesPassed++;
    if (test.time) {
      runtime += parseFloat(test.time);
    }
    memory = Math.max(memory, test.memory || 0);
  }

  return {
    // true && {a:1} returns {a:1} but false && {a:1} returns false
    ...(includeTestResult && {
      testResult,
    }),
    testCasesPassed,
    runtime,
    memory,
    status,
    errorMessage,
  };
};

module.exports = executeCode;
