const { redisClient } = require('../config/redis');

const asyncHandler = require('../utils/asyncHandler');
const sendTokenResponse = require('../utils/auth/sendTokenResponse');
const removeRefreshSession = require('../utils/auth/removeRefreshSession');
const STATUS_CODES = require('../constants/statusCodes');
const clearAuthCookies = require('../utils/auth/clearAuthCookies');
const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} = require('../utils/auth/cookieOptions');

const authService = require('../services/auth/authService');

const refreshUserSession = require('../services/auth/refreshSessionService');
const tokenService = require('../services/auth/tokenService');

const register = asyncHandler(async (req, res) => {
  await authService.registerUser(req.body, 'user');

  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: 'Verification email sent. Please verify your email before logging in.',
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  await authService.verifyEmailService(token);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Email verified successfully',
  });
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { emailId } = req.body;

  await authService.resendVerificationEmailService(emailId);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Verification email sent successfully',
  });
});

const login = asyncHandler(async (req, res) => {
  const { emailId, password } = req.body;

  const { accessToken, refreshToken, user } = await authService.loginUser(emailId, password);

  res.cookie('accessToken', accessToken, accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

  return sendTokenResponse(res, user, 'User logged in successfully', STATUS_CODES.OK);
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    try {
      const payload = tokenService.verifyRefreshToken(refreshToken);
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

const forgotPassword = asyncHandler(async (req, res) => {
  const { emailId } = req.body;

  await authService.forgotPasswordService(emailId);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Password reset email sent successfully',
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await authService.resetPasswordService(token, password);

  await removeRefreshSession(user._id);
  clearAuthCookies(res);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Password reset successful',
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await authService.changePasswordService(req.user._id, currentPassword, newPassword);

  await removeRefreshSession(user._id);
  clearAuthCookies(res);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Password changed successfully. Please login again.',
  });
});

const adminRegister = asyncHandler(async (req, res) => {
  await authService.registerUser({ ...req.body, isVerified: true }, 'admin');

  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: 'Admin registered successfully',
  });
});

const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await authService.deleteProfileService(userId);

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
