const asyncHandler = require('../utils/asyncHandler');
const STATUS_CODES = require('../constants/statusCodes');
const videoService = require('../services/video/videoService');

const uploadVideo = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const { youtubeUrl } = req.body;
  const userId = req.user._id;

  const video = await videoService.uploadVideoService(problemId, userId, youtubeUrl);

  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: 'Video solution uploaded successfully',
    data: video,
  });
});

const updateVideo = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const { youtubeUrl } = req.body;
  const userId = req.user._id;

  const video = await videoService.updateVideoService(problemId, userId, youtubeUrl);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Video solution updated successfully',
    data: video,
  });
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { problemId } = req.params;

  await videoService.deleteVideoService(problemId);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Video solution deleted successfully',
  });
});

module.exports = {
  uploadVideo,
  updateVideo,
  deleteVideo,
};
