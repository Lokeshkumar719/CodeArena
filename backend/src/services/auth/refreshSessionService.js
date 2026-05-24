const { redisClient } = require("../../config/redis");
const ApiError = require("../../utils/ApiError");
const STATUS_CODES = require("../../constants/statusCodes");
const AUTH_CONFIG=require("../../constants/authConstants");
const hashToken = require("../../utils/auth/hashToken");

const {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require("./tokenService");

// validate refresh session and rotate refresh token
const refreshUserSession = async (refreshToken) => {

  if (!refreshToken) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      "Refresh token missing",
    );
  }

  // verify refresh token JWT
  const payload = verifyRefreshToken(refreshToken);

  const { id } = payload;

  if (!id) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      "Invalid refresh token",
    );
  }

  // get stored hashed token from Redis
  const storedHashedToken = await redisClient.get(
    `refreshToken:${id}`,
  );

  if (!storedHashedToken) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      "Session expired",
    );
  }

  // hash incoming refresh token
  const hashedIncomingToken = hashToken(refreshToken);

  // compare hashes
  if (storedHashedToken !== hashedIncomingToken) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      "Invalid refresh session",
    );
  }

  // invalidate old refresh token
  await redisClient.del(`refreshToken:${id}`);

  // generate new access token
  const newAccessToken = generateAccessToken({
    id: payload.id,
    emailId: payload.emailId,
    role: payload.role,
  });

  // generate new refresh token
  const newRefreshToken = generateRefreshToken({
    id: payload.id,
    emailId: payload.emailId,
    role: payload.role,
  });

  // store new hashed refresh token
  await redisClient.set(
    `refreshToken:${id}`,
    hashToken(newRefreshToken),
    {
      EX: AUTH_CONFIG.REFRESH_COOKIE_MAX_AGE / 1000,
    },
  );

  return {
    accessToken:newAccessToken,
    refreshToken:newRefreshToken,
  };
};

module.exports = refreshUserSession;