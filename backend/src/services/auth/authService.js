const bcrypt = require('bcrypt');
const User = require('../../models/user');
const { redisClient } = require('../../config/redis');
const AUTH_CONFIG = require('../../constants/authConstants');
const generateTokens = require('../../utils/auth/generateTokens');
const hashToken = require('../../utils/auth/hashToken');
const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} = require('../../utils/auth/cookieOptions');

const storeRefreshSession = async (userId, refreshToken) => {
  // hash refresh token before storing
  const hashedRefreshToken = hashToken(refreshToken);
  // store hashed refresh token in Redis
  await redisClient.set(`refreshToken:${userId}`, hashedRefreshToken, {
    EX: AUTH_CONFIG.REFRESH_COOKIE_MAX_AGE / 1000,
  });
};

const registerUser = async (userData, role) => {
  const newUserData = {
    ...userData,
    role,
  };

  const user = await User.create(newUserData);

  return user;
};

const loginUser = async (user) => {
  const { accessToken, refreshToken } = generateTokens(user);
  await storeRefreshSession(user._id, refreshToken);
  return {
    accessToken,
    refreshToken,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
