const { submitBatch, submitToken } = require('../execution/judge0Service');

const { JUDGE0_STATUS } = require('../../constants/judgeStatus');
const { MAX_BATCH_SIZE } = require('../../constants/judge0');

const getSubmissionResult = require('../../utils/judge/getSubmissionResult');

const executeCode = async (
  testcases,
  code,
  languageId,
  executionLimits,
  includeTestResult = false
) => {
  const submissions = testcases.map((testcase) => ({
    source_code: code,
    language_id: languageId,
    stdin: testcase.input,
    expected_output: testcase.output,
    ...executionLimits,
  }));

  // submit in batch of 20 testCases
  const testResult = [];
  for (let i = 0; i < submissions.length; i += MAX_BATCH_SIZE) {
    const batch = submissions.slice(i, i + MAX_BATCH_SIZE);
    const submitResult = await submitBatch(batch);

    const resultTokens = submitResult.map((value) => value.token);
    const batchResult = await submitToken(resultTokens);

    testResult.push(...batchResult);
  }

  let testCasesPassed = 0;
  let runtime = 0;
  let memory = 0;
  let status = 'accepted';
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
      runtime = Math.max(runtime, parseFloat(test.time));
    }
    memory = Math.max(memory, test.memory || 0);
  }

  return {
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
