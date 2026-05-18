const cloudinary = require("cloudinary").v2;
const Problem = require("../models/problems");
const User = require("../models/user");
const SolutionVideo = require("../models/solutionVideo");
const asyncHandler = require("../utils/asyncHandler");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateUploadSignature = asyncHandler(async (req, res) => {
  const { problemId } = req.params;

  const userId = req.user._id;

  // Verify problem exists
  const problem = await Problem.findById(problemId);

  if (!problem) {
    return res.status(404).json({
      error: "Problem not found",
    });
  }

  // Generate unique public_id for the video
  const timestamp = Math.round(new Date().getTime() / 1000);

  const publicId = `leetcode-solutions/${problemId}/${userId}_${timestamp}`;

  // Upload parameters
  const uploadParams = {
    timestamp: timestamp,
    public_id: publicId,
  };

  // Generate signature
  const signature = cloudinary.utils.api_sign_request(
    uploadParams,
    process.env.CLOUDINARY_API_SECRET,
  );

  res.json({
    signature,
    timestamp,
    public_id: publicId,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
  });
});

const saveVideoMetadata = asyncHandler(async (req, res) => {
  const { problemId, cloudinaryPublicId, secureUrl, duration } = req.body;

  const userId = req.user._id;

  // Verify the upload with Cloudinary
  const cloudinaryResource = await cloudinary.api.resource(cloudinaryPublicId, {
    resource_type: "video",
  });

  if (!cloudinaryResource) {
    return res.status(400).json({
      error: "Video not found on Cloudinary",
    });
  }

  // Check if video already exists for this problem and user
  const existingVideo = await SolutionVideo.findOne({
    problemId,
    userId,
    cloudinaryPublicId,
  });

  if (existingVideo) {
    return res.status(409).json({
      error: "Video already exists",
    });
  }

  const thumbnailUrl = cloudinary.image(cloudinaryResource.public_id, {
    resource_type: "video",
  });

  // Create video solution record
  const videoSolution = await SolutionVideo.create({
    problemId,
    userId,
    cloudinaryPublicId,
    secureUrl,
    duration: cloudinaryResource.duration || duration,
    thumbnailUrl,
  });

  res.status(201).json({
    message: "Video solution saved successfully",
    videoSolution: {
      id: videoSolution._id,
      thumbnailUrl: videoSolution.thumbnailUrl,
      duration: videoSolution.duration,
      uploadedAt: videoSolution.createdAt,
    },
  });
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { problemId } = req.params;

  const userId = req.user._id;

  //    * invalidate:false (default)
  //     * File deleted from storage
  //     * But cached URL may still work temporarily
  //    * invalidate:true
  //     * Sends a CDN cache invalidation request
  //     * Cached versions are cleared faster
  //     * URL stops working sooner

  const video = await SolutionVideo.findOneAndDelete({
    problemId: problemId,
  });

  if (!video) {
    return res.status(404).json({
      error: "Video not found",
    });
  }

  await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
    resource_type: "video",
    invalidate: true,
  });

  res.json({
    message: "Video deleted successfully",
  });
});

module.exports = {
  generateUploadSignature,
  saveVideoMetadata,
  deleteVideo,
};
