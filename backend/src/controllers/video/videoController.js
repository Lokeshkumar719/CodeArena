const cloudinary = require('cloudinary').v2;

const { Problem } = require('../../models/problem');
const SolutionVideo = require('../../models/solutionVideo');

const asyncHandler = require('../../utils/asyncHandler');
const STATUS_CODES = require('../../constants/statusCodes');
const ApiError = require('../../utils/ApiError');
const validateObjectId = require('../../utils/validation/validateObjectId');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateUploadSignature = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  validateObjectId(problemId);
  const userId = req.user._id;
  // verify problem exists
  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Problem not found');
  }
  // allow only one video solution per problem
  const existingVideo = await SolutionVideo.findOne({
    problemId,
  });
  if (existingVideo) {
    throw new ApiError(STATUS_CODES.CONFLICT, 'Video solution already exists for this problem');
  }
  // generate unique public_id for video
  const timestamp = Math.round(new Date().getTime() / 1000);
  const publicId = `leetcode-solutions/${problemId}/${userId}_${timestamp}`;
  // upload parameters
  const uploadParams = {
    timestamp,
    public_id: publicId,
  };
  // generate cloudinary signature
  const signature = cloudinary.utils.api_sign_request(
    uploadParams,
    process.env.CLOUDINARY_API_SECRET
  );
  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: {
      signature,
      timestamp,
      public_id: publicId,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
    },
  });
});

const saveVideoMetadata = asyncHandler(async (req, res) => {
  const { problemId, cloudinaryPublicId, secureUrl, duration } = req.body;
  validateObjectId(problemId);
  const userId = req.user._id;
  // verify problem exists
  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Problem not found');
  }
  // allow only one video solution per problem
  const existingVideo = await SolutionVideo.findOne({
    problemId,
  });
  if (existingVideo) {
    throw new ApiError(STATUS_CODES.CONFLICT, 'Video solution already exists for this problem');
  }
  // verify upload exists on cloudinary
  const cloudinaryResource = await cloudinary.api.resource(cloudinaryPublicId, {
    resource_type: 'video',
  });
  if (!cloudinaryResource) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Video not found on Cloudinary');
  }
  const thumbnailUrl = cloudinary.image(cloudinaryResource.public_id, {
    resource_type: 'video',
  });
  // create solution video record
  const videoSolution = await SolutionVideo.create({
    problemId,
    userId,
    cloudinaryPublicId,
    secureUrl,
    duration: cloudinaryResource.duration || duration,
    thumbnailUrl,
  });

  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: 'Video solution saved successfully',
    data: {
      id: videoSolution._id,
      thumbnailUrl: videoSolution.thumbnailUrl,
      duration: videoSolution.duration,
      uploadedAt: videoSolution.createdAt,
    },
  });
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  validateObjectId(problemId);

  /*
    invalidate:false (default)
    file deleted from storage
    but cached URL may still work temporarily

    invalidate:true
    sends CDN cache invalidation request
    cached versions are cleared faster
    URL stops working sooner
  */

  const video = await SolutionVideo.findOneAndDelete({
    problemId,
  });

  if (!video) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Video not uploaded for this');
  }

  await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
    resource_type: 'video',
    invalidate: true,
  });

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Video deleted successfully',
  });
});

module.exports = {
  generateUploadSignature,
  saveVideoMetadata,
  deleteVideo,
};
