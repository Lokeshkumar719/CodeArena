const AUTH_CONFIG = require('../../constants/authConstants');

const isProduction = process.env.NODE_ENV === 'production';

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'strict',
  maxAge: AUTH_CONFIG.ACCESS_COOKIE_MAX_AGE,
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'strict',
  maxAge: AUTH_CONFIG.REFRESH_COOKIE_MAX_AGE,
};

module.exports = {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
};