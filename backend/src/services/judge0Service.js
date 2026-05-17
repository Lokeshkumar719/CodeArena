const judge0Client = require("../config/judge0Client");
const {
  MAX_POLLING_RETRIES,
  POLLING_INTERVAL,
} = require("../constants/judge0");

const waiting = (timer) => {
  return new Promise((resolve) => setTimeout(resolve, timer));
};

const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: "/submissions/batch",
    params: {
      base64_encoded: "false",
    },
    data: {
      submissions,
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
      base64_encoded: "false",
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
      if (isResultObtained) return submissions;
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
