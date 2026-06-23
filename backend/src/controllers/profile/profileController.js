const asyncHandler = require('../../utils/asyncHandler');
const {
  getProfileService,
  updateProfileService,
  getPublicProfileService,
} = require('../../services/profile/profileService');

const STATUS_CODES = require('../../constants/statusCodes');

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await getProfileService(req.user._id);

  res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Profile fetched successfully',
    data: profile,
  });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await updateProfileService(req.user._id, req.body);

  res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Profile updated successfully',
    data: profile,
  });
});

const getPublicProfile = asyncHandler(async (req, res) => {
  const profile = await getPublicProfileService(req.params.username);

  res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Profile fetched successfully',
    data: profile,
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
};
