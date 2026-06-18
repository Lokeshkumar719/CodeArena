const AUTH_CONFIG = {
  // access token should be short-lived
  ACCESS_TOKEN_EXPIRES_IN: '15m',

  // refresh token survives longer
  REFRESH_TOKEN_EXPIRES_IN: '7d',

  // cookie expiry timings in milliseconds
  ACCESS_COOKIE_MAX_AGE: 15 * 60 * 1000,

  REFRESH_COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000,

  RESET_PASSWORD_TOKEN_EXPIRY: 10 * 60 * 1000,

  EMAIL_VERIFICATION_EXPIRY: 2 * 60 * 60 * 1000,
};

module.exports = AUTH_CONFIG;
