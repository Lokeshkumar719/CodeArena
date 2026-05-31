const User = require('../../models/user');

const asyncHandler = require('../../utils/asyncHandler');
const STATUS_CODES = require('../../constants/statusCodes');
const ApiError = require('../../utils/ApiError');

const { verifyAccessToken } = require('../../services/auth/tokenService');

// this middleware checks whether the user is authenticated or not
const authMiddleware = asyncHandler(async (req, res, next) => {
  // access token now comes from accessToken cookie
  const { accessToken } = req.cookies;
  if (!accessToken) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Unauthorized access");
  }
  const payload = verifyAccessToken(accessToken);
  const { id } = payload;
  if (!id) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid token");
  }
  // check whether user still exists in database
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "User does not exist");
  }
  // attach authenticated user to request object
  // so future controllers can access req.user
  req.user = user;
  next();
});
module.exports = authMiddleware;