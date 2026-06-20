const judge0Client = require('../../config/judge0Client');

const decodeBase64 = require('../../utils/judge/decodeBase64');
const encodeBase64 = require('../../utils/judge/encodeBase64');

const { MAX_POLLING_RETRIES, POLLING_INTERVAL } = require('../../constants/judge0');

const ApiError = require('../../utils/ApiError');
const STATUS_CODES = require('../../constants/statusCodes');

const waiting = (timer) => {
  return new Promise((resolve) => setTimeout(resolve, timer));
};

const handleJudge0Error = (error) => {
  console.error(
    'Judge0 Error:',
    error.response?.data?.error || error.response?.data?.message || error.message
  );

  const judge0Unavailable =
    error.response?.status === 403 ||
    error.code === 'ECONNREFUSED' ||
    error.code === 'ECONNABORTED' ||
    error.code === 'ETIMEDOUT';

  if (judge0Unavailable) {
    throw new ApiError(
      STATUS_CODES.SERVICE_UNAVAILABLE,
      'Code execution service is temporarily unavailable. Please try again later.'
    );
  }

  throw new ApiError(
    STATUS_CODES.BAD_REQUEST,
    error.response?.data?.error || error.response?.data?.message || 'Judge0 request failed'
  );
};

const submitBatch = async (submissions) => {
  const encodedSubmissions = submissions.map((submission) => ({
    ...submission,
    source_code: encodeBase64(submission.source_code),
    stdin: encodeBase64(submission.stdin),
    expected_output: encodeBase64(submission.expected_output),
  }));

  const options = {
    method: 'POST',
    url: '/submissions/batch',
    params: {
      base64_encoded: 'true',
    },
    data: {
      submissions: encodedSubmissions,
    },
  };

  try {
    const response = await judge0Client.request(options);
    return response.data;
  } catch (error) {
    handleJudge0Error(error);
  }
};

const submitToken = async (resultTokens) => {
  const options = {
    method: 'GET',
    url: '/submissions/batch',
    params: {
      tokens: resultTokens.join(','),
      base64_encoded: 'true',
      fields: '*',
    },
  };

  for (let retry = 0; retry < MAX_POLLING_RETRIES; retry++) {
    try {
      const response = await judge0Client.request(options);
      const results = response.data;
      const submissions = results.submissions;

      const isResultObtained = submissions.every((result) => result.status.id > 2);

      if (isResultObtained) {
        const decodedSubmissions = submissions.map((submission) => ({
          ...submission,
          stdout: decodeBase64(submission.stdout),
          stderr: decodeBase64(submission.stderr),
          compile_output: decodeBase64(submission.compile_output),
          message: decodeBase64(submission.message),
          stdin: decodeBase64(submission.stdin),
          expected_output: decodeBase64(submission.expected_output),
        }));

        return decodedSubmissions;
      }

      await waiting(POLLING_INTERVAL);
    } catch (error) {
      handleJudge0Error(error);
    }
  }

  throw new ApiError(
    STATUS_CODES.SERVICE_UNAVAILABLE,
    'Code execution service is temporarily unavailable. Please try again later.'
  );
};

module.exports = {
  submitBatch,
  submitToken,
};
