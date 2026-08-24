const validator = require('validator');
const STATUS_CODES = require('../constants/statusCodes');
const ApiError = require('../utils/ApiError');

const validateUserRegistration = (req, res, next) => {
  const data = req.body;
  const mandatoryField = ['username', 'emailId', 'password'];

  const isAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));

  if (!isAllowed) {
    return next(new ApiError(STATUS_CODES.BAD_REQUEST, 'Some Field Missing'));
  }

  if (!validator.isEmail(data.emailId)) {
    return next(new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid Email'));
  }

  if (
    !validator.isStrongPassword(data.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return next(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        'Password must contain uppercase, lowercase, number, special character and be at least 8 characters long'
      )
    );
  }

  const name = data.username?.trim();

  if (!name) {
    return next(new ApiError(STATUS_CODES.BAD_REQUEST, 'username is required'));
  }

  if (name.length < 3 || name.length > 20) {
    return next(new ApiError(STATUS_CODES.BAD_REQUEST, 'username must be 3-20 characters long'));
  }

  next();
};

module.exports = validateUserRegistration;
