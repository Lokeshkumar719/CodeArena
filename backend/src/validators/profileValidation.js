const validator = require('validator');
const ApiError = require('../utils/ApiError');
const STATUS_CODES = require('../constants/statusCodes');

const validateProfileUpdate = (req, res, next) => {
  const { username, bio, institution } = req.body;

  if (username !== undefined) {
    if (username.length < 3 || username.length > 20) {
      return next(
        new ApiError(STATUS_CODES.BAD_REQUEST, 'Username must be between 3 and 20 characters')
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return next(
        new ApiError(
          STATUS_CODES.BAD_REQUEST,
          'Username can only contain letters, numbers and underscores'
        )
      );
    }
  }

  if (bio !== undefined && bio.length > 200) {
    return next(new ApiError(STATUS_CODES.BAD_REQUEST, 'Bio cannot exceed 200 characters'));
  }

  if (institution !== undefined && institution.length > 100) {
    return next(new ApiError(STATUS_CODES.BAD_REQUEST, 'Institution cannot exceed 100 characters'));
  }

  next();
};

module.exports = {
  validateProfileUpdate,
};
