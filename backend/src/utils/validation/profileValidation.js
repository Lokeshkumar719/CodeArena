const validator = require('validator');
const ApiError = require('../ApiError');
const STATUS_CODES = require('../../constants/statusCodes');

const validateProfileUpdate = ({ username, bio, institution }) => {
  if (username !== undefined) {
    if (username.length < 3 || username.length > 20) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Username must be between 3 and 20 characters');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        'Username can only contain letters, numbers and underscores'
      );
    }
  }

  if (bio !== undefined && bio.length > 200) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Bio cannot exceed 200 characters');
  }

  if (institution !== undefined && institution.length > 100) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Institution cannot exceed 100 characters');
  }
};

module.exports = {
  validateProfileUpdate,
};
