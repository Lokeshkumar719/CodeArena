const jwt = require("jsonwebtoken");

const AUTH_CONFIG = require("../../constants/authConstants");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: AUTH_CONFIG.ACCESS_TOKEN_EXPIRES_IN,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
    expiresIn: AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_IN,
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_KEY);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
