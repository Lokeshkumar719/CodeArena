const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const STATUS_CODES = require('../../constants/statusCodes');

// this middleware only checks whether authenticated user is admin or not
const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(STATUS_CODES.FORBIDDEN, 'Access denied');
  }
  next();
});

module.exports = adminMiddleware;
