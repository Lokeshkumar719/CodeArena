const {
  JUDGE0_STATUS,
  JUDGE0_STATUS_MESSAGES,
} = require("../../constants/judgeStatus");

const normalizeText = (text = "") => {
  return text.toLowerCase();
};

const cleanRuntimeError = (error = "") => {
  return error
    .replace(/run\.sh: line \d+:/g, "")
    .replace(/LD_LIBRARY_PATH=.*?\/a\.out/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const detectMemoryLimitExceeded = (test) => {
  const stderr = normalizeText(test.stderr);
  const message = normalizeText(test.message);
  const description = normalizeText(test.status?.description);

  return (
    stderr.includes("killed") ||
    message.includes("killed") ||
    description.includes("memory limit exceeded") ||
    test.exit_code === 137 ||
    test.signal === "SIGKILL"
  );
};

const detectOutputLimitExceeded = (test) => {
  const stderr = normalizeText(test.stderr);
  const message = normalizeText(test.message);

  return (
    stderr.includes("output limit") ||
    message.includes("output limit")
  );
};

const getRuntimeErrorResult = (test) => {
  if(detectMemoryLimitExceeded(test)) {
    return {
      status: "memory_limit_exceeded",
      errorMessage: "Memory Limit Exceeded",
    };
  }

  if(detectOutputLimitExceeded(test)) {
    return {
      status: "output_limit_exceeded",
      errorMessage: "Output Limit Exceeded",
    };
  }

  return {
    status: "runtime_error",
    errorMessage: cleanRuntimeError(
      test.stderr ||
      test.message ||
      test.status?.description ||
      JUDGE0_STATUS_MESSAGES[test.status.id] ||
      "Runtime Error"
    ),
  };
};

const getSubmissionResult = (test) => {
  switch(test.status.id) {

    case JUDGE0_STATUS.ACCEPTED:
      return {
        status: "accepted",
        errorMessage: null,
      };

    case JUDGE0_STATUS.WRONG_ANSWER:
      return {
        status: "wrong_answer",
        errorMessage: JUDGE0_STATUS_MESSAGES[test.status.id],
      };

    case JUDGE0_STATUS.TIME_LIMIT_EXCEEDED:
      return {
        status: "time_limit_exceeded",
        errorMessage: JUDGE0_STATUS_MESSAGES[test.status.id],
      };

    case JUDGE0_STATUS.COMPILE_ERROR:
      return {
        status: "compile_error",
        errorMessage:
          test.compile_output ||
          JUDGE0_STATUS_MESSAGES[test.status.id],
      };

    case JUDGE0_STATUS.RUNTIME_ERROR_SIGSEGV:
    case JUDGE0_STATUS.RUNTIME_ERROR_SIGXFSZ:
    case JUDGE0_STATUS.RUNTIME_ERROR_SIGFPE:
    case JUDGE0_STATUS.RUNTIME_ERROR_SIGABRT:
    case JUDGE0_STATUS.RUNTIME_ERROR_NZEC:
    case JUDGE0_STATUS.RUNTIME_ERROR_OTHER:
      return getRuntimeErrorResult(test);

    case JUDGE0_STATUS.INTERNAL_ERROR:
    case JUDGE0_STATUS.EXEC_FORMAT_ERROR:
      return {
        status: "internal_error",
        errorMessage:
          JUDGE0_STATUS_MESSAGES[test.status.id],
      };

    default:
      return {
        status: "internal_error",
        errorMessage: "Internal Judge Error",
      };
  }
};

module.exports = getSubmissionResult;