const User = require('../models/user');

const createUser = async (userData) => {
  return await User.create(userData);
};

const findUserById = async (userId) => {
  return await User.findById(userId);
};

const findUserByIdWithSelectedFields = async (userId, fields) => {
  return await User.findById(userId).select(fields);
};

const findUserByUsernameExcludingId = async (username, excludeUserId) => {
  return await User.findOne({
    username,
    _id: { $ne: excludeUserId },
  });
};

const findUserByUsernameWithSelectedFields = async (username, fields) => {
  return await User.findOne({ username }).select(fields);
};

const findUserByEmail = async (emailId) => {
  return await User.findOne({ emailId });
};

const findUserByEmailVerificationToken = async (hashedToken) => {
  return await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpires: { $gt: Date.now() },
  });
};

const findUserByResetPasswordToken = async (hashedToken) => {
  return await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
};

const deleteUnverifiedUsersOlderThan = async (cutoffDate) => {
  return await User.deleteMany({
    isVerified: false,
    createdAt: {
      $lt: cutoffDate,
    },
  });
};

const deleteUserById = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

const saveUser = async (user) => {
  return await user.save();
};

module.exports = {
  createUser,
  findUserById,
  findUserByIdWithSelectedFields,
  findUserByUsernameExcludingId,
  findUserByUsernameWithSelectedFields,
  findUserByEmail,
  findUserByEmailVerificationToken,
  findUserByResetPasswordToken,
  deleteUnverifiedUsersOlderThan,
  deleteUserById,
  saveUser,
};
