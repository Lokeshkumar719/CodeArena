const judge0Client = require("../config/judge0Client");
const decodeBase64 = require("../utils/decodeBase64");
const encodeBase64 = require("../utils/encodeBase64");
const {
  MAX_POLLING_RETRIES,
  POLLING_INTERVAL,
} = require("../constants/judge0");

const waiting = (timer) => {
  return new Promise((resolve) => setTimeout(resolve, timer));
};

const submitBatch = async (submissions) => {
  console.log('hey i am inside submitBatch');
  const encodedSubmissions = submissions.map((submission) => ({
    ...submission,
    source_code: encodeBase64(submission.source_code),
    stdin: encodeBase64(submission.stdin),
    expected_output: encodeBase64(submission.expected_output),
  }));

  const options = {
    method: "POST",
    url: "/submissions/batch",
    params: {
      base64_encoded: "true",
    },
    data: {
      submissions: encodedSubmissions,
    },
  };

  try {
    const response = await judge0Client.request(options);
    return response.data;
  } catch (error) {
    console.error("The error is: " + error);
    throw error;
  }
};

const submitToken = async (resultTokens) => {
  const options = {
    method: "GET",
    url: "/submissions/batch",
    params: {
      tokens: resultTokens.join(","),
      base64_encoded: "true",
      fields: "*",
    },
  };

  for (let retry = 0; retry < MAX_POLLING_RETRIES; retry++) {
    try {
      const response = await judge0Client.request(options);
      const results = response.data;
      const submissions = results.submissions;
      const isResultObtained = submissions.every(
        (result) => result.status.id > 2,
      );
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
      console.error(error);
      throw error;
    }
  }
  throw new Error("Judge0 polling timeout exceeded");
};

module.exports = {
  submitBatch,
  submitToken,
};
