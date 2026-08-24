const STATUS_CODES = require('../constants/statusCodes');
const ApiError = require('../utils/ApiError');

const validateSubmissionInput = (req, res, next) => {
  const userId = req.user?._id;
  const problemId = req.params?.id;
  const { code, language } = req.body;

  if (!userId || !problemId || !code || !language) {
    return next(new ApiError(STATUS_CODES.BAD_REQUEST, 'Some fields are missing'));
  }

  next();
};

module.exports = validateSubmissionInput;
