const User = require('../../models/user');
const Submission = require('../../models/submission');

const RESERVED_USERNAMES = require('../../constants/reservedUsernames');
const STATUS_CODES = require('../../constants/statusCodes');

const ApiError = require('../../utils/ApiError');
const { validateProfileUpdate } = require('../../utils/validation/profileValidation');

const { getProfileStats } = require('./profileStatsService');

const PROFILE_FIELDS = 'username emailId bio institution createdAt problemSolved';

const getProfileService = async (userId) => {
  const user = await User.findById(userId).select(PROFILE_FIELDS);

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }

  const stats = await getProfileStats(user._id, user.problemSolved.length);

  return {
    username: user.username,
    emailId: user.emailId,
    bio: user.bio,
    institution: user.institution,
    joinedAt: user.createdAt,
    ...stats,
  };
};

const updateProfileService = async (userId, { username, bio, institution }) => {
  validateProfileUpdate({ username, bio, institution });

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }

  if (username && username !== user.username) {
    if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'This username is reserved');
    }

    const existingUser = await User.findOne({
      username,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new ApiError(STATUS_CODES.CONFLICT, 'Username already exists');
    }

    user.username = username;
  }

  if (bio !== undefined) {
    user.bio = bio;
  }

  if (institution !== undefined) {
    user.institution = institution;
  }

  await user.save();

  return {
    username: user.username,
    emailId: user.emailId,
    bio: user.bio,
    institution: user.institution,
    joinedAt: user.createdAt,
  };
};

const getPublicProfileService = async (username) => {
  const user = await User.findOne({
    username,
  }).select('username bio institution createdAt problemSolved');

  if (!user) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'User not found');
  }

  const stats = await getProfileStats(user._id, user.problemSolved.length);

  return {
    username: user.username,
    bio: user.bio,
    institution: user.institution,
    joinedAt: user.createdAt,
    ...stats,
  };
};

module.exports = {
  getProfileService,
  updateProfileService,
  getPublicProfileService,
};
