const STATUS_CODES = require('../../constants/statusCodes');

const ApiError = require('../ApiError');

const validateSubmissionInput = (userId, problemId, code, language) => {
  if (!userId || !problemId || !code || !language) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Some fields are missing');
  }
};

module.exports = validateSubmissionInput;
