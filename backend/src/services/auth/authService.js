const crypto = require('crypto');
const bcrypt = require('bcrypt');

const userRepository = require('../../repositories/userRepository');

const { redisClient } = require('../../config/redis');

const AUTH_CONFIG = require('../../constants/authConstants');
const STATUS_CODES = require('../../constants/statusCodes');

const ApiError = require('../../utils/ApiError');
const generateTokens = require('../../utils/auth/generateTokens');
const hashToken = require('../../utils/auth/hashToken');
const validatePassword = require('../../utils/auth/validatePassword');

const sendEmail = require('./emailService');
const verificationEmailTemplate = require('../../templates/verificationEmailTemplate');
const resetPasswordEmailTemplate = require('../../templates/resetPasswordEmailTemplate');
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

  const user = await userRepository.createUser(newUserData);

  if (role === 'user') {
    const verificationToken = user.createEmailVerificationToken();

    await userRepository.saveUser(user);

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    try {
      await sendEmail({
        to: user.emailId,
        subject: 'Verify Your CodeArena Account',
        html: verificationEmailTemplate(verificationUrl),
      });
    } catch (err) {
      user.emailVerificationToken = undefined;
      user.emailVerificationTokenExpires = undefined;

      await userRepository.saveUser(user);

      throw new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Verification email could not be sent'
      );
    }
  }

  return user;
};

const loginUser = async (emailId, password) => {
  if (!emailId || !password) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email and password are required');
  }

  const user = await userRepository.findUserByEmail(emailId);
  if (!user) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid credentials');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid credentials');
  }

  if (!user.isVerified) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Please verify your email before logging in');
  }

  const { accessToken, refreshToken } = generateTokens(user);
  await storeRefreshSession(user._id, refreshToken);
  return {
    accessToken,
    refreshToken,
    user,
  };
};

const verifyEmailService = async (token) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await userRepository.findUserByEmailVerificationToken(hashedToken);

  if (!user) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid or expired verification token');
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;

  await userRepository.saveUser(user);
};

const resendVerificationEmailService = async (emailId) => {
  if (!emailId) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email is required');
  }

  const user = await userRepository.findUserByEmail(emailId);

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }

  if (user.isVerified) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Email is already verified');
  }

  const verificationToken = user.createEmailVerificationToken();

  await userRepository.saveUser(user);

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  try {
    await sendEmail({
      to: user.emailId,
      subject: 'Verify Your CodeArena Account',
      html: verificationEmailTemplate(verificationUrl),
    });
  } catch (err) {
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await userRepository.saveUser(user);
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Verification email could not be sent');
  }
};

const forgotPasswordService = async (emailId) => {
  const user = await userRepository.findUserByEmail(emailId);

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'If account exists, reset email sent.');
  }

  const resetToken = user.createResetPasswordToken();
  await userRepository.saveUser(user);

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.emailId,
    subject: 'CodeArena Password Reset',
    html: resetPasswordEmailTemplate(resetPasswordUrl),
  });
};

const resetPasswordService = async (token, password) => {
  validatePassword(password);

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await userRepository.findUserByResetPasswordToken(hashedToken);

  if (!user) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid or expired reset token');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await userRepository.saveUser(user);

  return user;
};

const changePasswordService = async (userId, currentPassword, newPassword) => {
  validatePassword(newPassword);

  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }

  const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Current password is incorrect');
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'New password cannot be same as current password');
  }

  user.password = newPassword;
  await userRepository.saveUser(user);

  return user;
};

const deleteProfileService = async (userId) => {
  await redisClient.del(`refreshToken:${userId}`);
  await userRepository.deleteUserById(userId);
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmailService,
  resendVerificationEmailService,
  forgotPasswordService,
  resetPasswordService,
  changePasswordService,
  deleteProfileService,
};
