const jwt = require("jsonwebtoken");

const AUTH_CONFIG = require("../constants/authConstants");
const STATUS_CODES = require("../constants/statusCodes");

const sendTokenResponse = (res, user, message, statusCode) => {
  // JWT payload stores identity and authorization-related data
  const token = jwt.sign(
    {
      id: user._id,
      emailId: user.emailId,
      role: user.role,
    },
    process.env.JWT_KEY,
    {
      expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN,
    },
  );

  // store JWT securely inside HTTP-only cookie
  res.cookie("token", token, {
    maxAge: AUTH_CONFIG.COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "strict",
  });

  // user data sent back to frontend
  const reply = {
    firstName: user.firstName,
    emailId: user.emailId,
    _id: user._id,
    role: user.role,
  };

  return res.status(statusCode).json({
    success: true,
    message,
    data: reply,
  });
};

module.exports = sendTokenResponse;