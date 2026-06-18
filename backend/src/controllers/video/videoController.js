const cloudinary = require('cloudinary').v2;

const { Problem } = require('../../models/problem');
const SolutionVideo = require('../../models/solutionVideo');

const asyncHandler = require('../../utils/asyncHandler');
const STATUS_CODES = require('../../constants/statusCodes');
const ApiError = require('../../utils/ApiError');
const validateObjectId = require('../../utils/validation/validateObjectId');


const uploadVideo = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const { youtubeUrl } = req.body;

  validateObjectId(problemId);

  const userId = req.user._id;

  const problem = await Problem.findById(problemId);

  if (!problem) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      'Problem not found'
    );
  }

  const existingVideo = await SolutionVideo.findOne({
    problemId,
  });

 
  if (existingVideo) {
    throw new ApiError(
      STATUS_CODES.CONFLICT,
      'Video solution already exists for this problem'
    );
  }

  const video = await SolutionVideo.create({
    problemId,
    userId,
    youtubeUrl,
  });

  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: 'Video solution uploaded successfully',
    data: video,
  });
});

const updateVideo = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  const { youtubeUrl } = req.body;

  validateObjectId(problemId);

  const video = await SolutionVideo.findOneAndUpdate(
    {
      problemId,
    },
    {
      youtubeUrl,
      userId: req.user._id,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!video) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      'Video solution not found'
    );
  }

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Video solution updated successfully',
    data: video,
  });
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { problemId } = req.params;

  validateObjectId(problemId);

  const video = await SolutionVideo.findOneAndDelete({
    problemId,
  });

  if (!video) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      'Video solution not found'
    );
  }

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
