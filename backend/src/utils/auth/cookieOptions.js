const AUTH_CONFIG = require("../../constants/authConstants");

const accessTokenCookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  maxAge: AUTH_CONFIG.ACCESS_COOKIE_MAX_AGE,
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  maxAge: AUTH_CONFIG.REFRESH_COOKIE_MAX_AGE,
};

module.exports = {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
};
