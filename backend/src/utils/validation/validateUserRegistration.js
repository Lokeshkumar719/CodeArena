const validator = require('validator');
const STATUS_CODES = require('../../constants/statusCodes');
const ApiError = require('../ApiError');

const validateUser = async (data) => {
  const mandatoryField = ['firstName', 'emailId', 'password'];

  const isAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));

  if (!isAllowed) throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Some Field Missing');

  if (!validator.isEmail(data.emailId))
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid Email');

  if (
    !validator.isStrongPassword(data.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Password must contain uppercase, lowercase, number, special character and be at least 8 characters long'
    );
  }

  const name = data.firstName?.trim();

  if (!name) throw new ApiError(STATUS_CODES.BAD_REQUEST, 'First name is required');

  if (name.length < 3 || name.length > 20)
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'First name must be 3-20 characters long');
};

module.exports = validateUser;
