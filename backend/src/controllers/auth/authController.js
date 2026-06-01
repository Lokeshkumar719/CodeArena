const { redisClient } = require('../../config/redis');
const User = require('../../models/user');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const validateUserRegistration = require('../../utils/validation/validateUserRegistration');
const validatePassword = require('../../utils/auth/validatePassword');

const asyncHandler = require('../../utils/asyncHandler');
const sendTokenResponse = require('../../utils/auth/sendTokenResponse');
const removeRefreshSession = require('../../utils/auth/removeRefreshSession');

const STATUS_CODES = require('../../constants/statusCodes');
const ApiError = require('../../utils/ApiError');
const clearAuthCookies = require('../../utils/auth/clearAuthCookies');

const { registerUser, loginUser } = require('../../services/auth/authService');
const refreshUserSession = require('../../services/auth/refreshSessionService');
const { verifyRefreshToken } = require('../../services/auth/tokenService');
const verificationEmailTemplate = require('../../services/auth/emailTemplates/verificationEmailTemplate');

const resetPasswordEmailTemplate = require('../../services/auth/emailTemplates/resetPasswordEmailTemplate');

const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} = require('../../utils/auth/cookieOptions');
const sendEmail = require('../../services/auth/emailService'); // service handles templates

// ----------------------------
// Register User
// ----------------------------
const register = asyncHandler(async (req, res) => {
  await validateUserRegistration(req.body);

  const user = await registerUser(req.body, 'user');

  const verificationToken = user.createEmailVerificationToken();

  await user.save({
    validateBeforeSave: false,
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  try {
    await sendEmail({
      to: user.emailId,
      subject: 'Verify Your CodeArena Account',
      html: verificationEmailTemplate(verificationUrl),
    });

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: 'Verification email sent. Please verify your email before logging in.',
    });
  } catch (err) {
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Verification email could not be sent');
  }
});

// ----------------------------
// Verify Email
// ----------------------------
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid or expired verification token');

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Email verified successfully',
  });
});

// ----------------------------
// Resend Verification Email
// ----------------------------
const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { emailId } = req.body;

  if (!emailId) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email is required');
  }

  const user = await User.findOne({ emailId });

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }

  if (user.isVerified) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email is already verified');
  }

  const verificationToken = user.createEmailVerificationToken();

  await user.save({
    validateBeforeSave: false,
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  await sendEmail({
    to: user.emailId,
    subject: 'Verify Your CodeArena Account',
    html: verificationEmailTemplate(verificationUrl),
  });

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Verification email sent successfully',
  });
});

// ----------------------------
// Login
// ----------------------------
const login = asyncHandler(async (req, res) => {
  const { emailId, password } = req.body;
  if (!emailId || !password)
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email and password are required');

  const user = await User.findOne({ emailId });
  if (!user) throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid credentials');

  if (!user.isVerified)
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Please verify your email before logging in');

  const { accessToken, refreshToken } = await loginUser(user);

  res.cookie('accessToken', accessToken, accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

  return sendTokenResponse(res, user, 'User logged in successfully', STATUS_CODES.OK);
});

// ----------------------------
// Logout
// ----------------------------
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      await redisClient.del(`refreshToken:${payload.id}`);
    } catch (err) {
      console.error(err);
    }
  }
  clearAuthCookies(res);
  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'User logged out successfully',
  });
});

// ----------------------------
// Refresh Access Token
// ----------------------------
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  const { accessToken, refreshToken: newRefreshToken } = await refreshUserSession(refreshToken);

  res.cookie('accessToken', accessToken, accessTokenCookieOptions);
  res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Access token refreshed successfully',
  });
});

// ----------------------------
// Forgot Password
// ----------------------------
const forgotPassword = asyncHandler(async (req, res) => {
  const { emailId } = req.body;
  const user = await User.findOne({ emailId });

  if (!user) throw new ApiError(STATUS_CODES.NOT_FOUND, 'If account exists, reset email sent.');

  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.emailId,
    subject: 'CodeArena Password Reset',
    type: 'reset',
    token: resetToken,
  });

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Password reset email sent successfully',
  });
});

// ----------------------------
// Reset Password
// ----------------------------
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  validatePassword(password);

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid or expired reset token');

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  await removeRefreshSession(user._id);
  clearAuthCookies(res);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Password reset successful',
  });
});

// ----------------------------
// Change Password
// ----------------------------
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  validatePassword(newPassword);

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');

  const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordCorrect)
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Current password is incorrect');

  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword)
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'New password cannot be same as current password');

  user.password = newPassword;
  await user.save();

  await removeRefreshSession(user._id);
  clearAuthCookies(res);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Password changed successfully. Please login again.',
  });
});

// ----------------------------
// Admin Register
// ----------------------------
const adminRegister = asyncHandler(async (req, res) => {
  await validateUserRegistration(req.body);

  const user = await registerUser({ ...req.body, isVerified: true }, 'admin');
  const { accessToken, refreshToken } = await loginUser(user);

  res.cookie('accessToken', accessToken, accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

  return sendTokenResponse(res, user, 'Admin registered successfully', STATUS_CODES.CREATED);
});

// ----------------------------
// Delete Profile
// ----------------------------
const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await redisClient.del(`refreshToken:${userId}`);
  await User.findByIdAndDelete(userId);
  clearAuthCookies(res);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'User deleted successfully',
  });
});

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  refreshAccessToken,
  adminRegister,
  deleteProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  resendVerificationEmail,
};
