const mongoose = require('mongoose');
const STATUS_CODES = require('../constants/statusCodes');
const ApiError = require('../utils/ApiError');

const validateObjectIdParams = (paramName) => (req, res, next) => {
  const id = req.params[paramName];
  if (!id) {
    return next(new ApiError(STATUS_CODES.BAD_REQUEST, 'Id is required'));
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid id'));
  }

  next();
};

module.exports = validateObjectIdParams;
