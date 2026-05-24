const Problem = require("../../models/problems");

const STATUS_CODES = require("../../constants/statusCodes");

const ApiError = require("../../utils/ApiError");

const getProblemById = async (problemId) => {
  const problem = await Problem.findById(problemId);

  if (!problem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "Problem not found");
  }

  return problem;
};

module.exports = {
  getProblemById,
};
