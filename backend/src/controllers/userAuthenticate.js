const { redisClient } = require("../config/redis");
const User = require("../models/user");
const validate = require("../utils/validate");
const validatePassword = require("../utils/auth/validatePassword");
const asyncHandler = require("../utils/asyncHandler");
const sendTokenResponse = require("../utils/sendTokenResponse");
const removeRefreshSession = require("../utils/auth/removeRefreshSession");
const STATUS_CODES = require("../constants/statusCodes");
const ApiError = require("../utils/ApiError");
const clearAuthCookies = require("../utils/auth/clearAuthCookies");

const { registerUser, loginUser } = require("../services/auth/authService");
const refreshUserSession = require("../services/auth/refreshSessionService");

const { verifyRefreshToken } = require("../services/auth/tokenService");
const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} = require("../utils/auth/cookieOptions");
const sendEmail = require("../services/auth/emailService");
const crypto = require("crypto");
const bcrypt = require("bcrypt");



const register = asyncHandler(async (req, res) => {
  await validate(req.body);
  const { user, accessToken, refreshToken } = await registerUser(
    req.body,
    "user",
  );
  // set access token cookie
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  // set refresh token cookie
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
  return sendTokenResponse(
    res,
    user,
    "User registered successfully",
    STATUS_CODES.CREATED,
  );
});

const login = asyncHandler(async (req, res) => {
  const { emailId, password } = req.body;
  if (!emailId || !password) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Email and password are required",
    );
  }
  const user = await User.findOne({ emailId });
  if (!user) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid credentials");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid credentials");
  }
  const { accessToken, refreshToken } = await loginUser(user);
  // set access token cookie
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  // set refresh token cookie
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  return sendTokenResponse(
    res,
    user,
    "User logged in successfully",
    STATUS_CODES.OK,
  );
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const { id } = payload;
      await redisClient.del(`refreshToken:${id}`);
    } catch (err) {
      console.error(err);
    }
  }
  clearAuthCookies(res);
  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "User logged out successfully",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {

  const { refreshToken } = req.cookies;

  const {
    accessToken,
    refreshToken:newRefreshToken,
  } = await refreshUserSession(refreshToken);

  // set new access token cookie
  res.cookie(
    "accessToken",
    accessToken,
    accessTokenCookieOptions,
  );

  // rotate refresh token cookie
  res.cookie(
    "refreshToken",
    newRefreshToken,
    refreshTokenCookieOptions,
  );

  return res.status(STATUS_CODES.OK).json({
    success:true,
    message:"Access token refreshed successfully",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { emailId } = req.body;
  const user = await User.findOne({ emailId });
  if (!user) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      "If account exists, reset email sent.",
    );
  }
  const resetToken = user.createResetPasswordToken();
  await user.save({
    validateBeforeSave: false,
  });
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  try {
    await sendEmail({
      to: user.emailId,
      subject: "CodeArena Password Reset",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetPasswordUrl}">
          Reset Password
        </a>
        <p>This link will expire in 10 minutes.</p>
      `,
    });
    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({
      validateBeforeSave: false,
    });
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      "Email could not be sent",
    );
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  validatePassword(password);
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // get only those users whose
  // resetPasswordExpires > current time
  // and token matches
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Invalid or expired reset token",
    );
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  // invalidate refresh session
  await removeRefreshSession(user._id);

  // clear auth cookies
  clearAuthCookies(res);
  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Password reset successful",
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  validatePassword(newPassword);
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "User not found");
  }
  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password,
  );
  if (!isPasswordCorrect) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Current password is incorrect",
    );
  }
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "New password cannot be same as current password",
    );
  }
  user.password = newPassword;
  await user.save();
  // invalidate refresh session from Redis
  await removeRefreshSession(user._id);
  // clear auth cookies
  clearAuthCookies(res);
  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Password changed successfully. Please login again.",
  });
});

const adminRegister = asyncHandler(async (req, res) => {
  await validate(req.body);
  const { user, accessToken, refreshToken } = await registerUser(
    req.body,
    "admin",
  );
  // set access token cookie
  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  // set refresh token cookie
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
  return sendTokenResponse(
    res,
    user,
    "Admin registered successfully",
    STATUS_CODES.CREATED,
  );
});

const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await redisClient.del(`refreshToken:${userId}`);
  await User.findByIdAndDelete(userId);
  clearAuthCookies(res);
  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "User deleted successfully",
  });
});


module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
  adminRegister,
  deleteProfile,
  forgotPassword,
  resetPassword,
  changePassword,
};