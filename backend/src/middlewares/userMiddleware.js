const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { redisClient } = require("../config/redis");
const asyncHandler = require("../utils/asyncHandler");
const STATUS_CODES = require("../constants/statusCodes");
const ApiError = require("../utils/ApiError");

// this middleware checks whether the user is authenticated or not
const userMiddleware = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Unauthorized access");
  }

  // jwt.verify() either returns decoded payload
  // OR throws an error immediately if token is invalid/expired
  const payload = jwt.verify(token, process.env.JWT_KEY);

  const { id } = payload;

  if (!id) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid token");
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "User does not exist");
  }

  const isBlocked = await redisClient.exists(`token:${token}`);

  if (isBlocked) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid token");
  }

  req.user = user;

  next();
});

module.exports = userMiddleware;
