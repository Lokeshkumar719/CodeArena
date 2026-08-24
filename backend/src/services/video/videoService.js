const STATUS_CODES = require('../../constants/statusCodes');
const ApiError = require('../../utils/ApiError');
const problemRepository = require('../../repositories/problemRepository');
const solutionVideoRepository = require('../../repositories/solutionVideoRepository');

const uploadVideoService = async (problemId, userId, youtubeUrl) => {
  const problem = await problemRepository.findProblemById(problemId);
  if (!problem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Problem not found');
  }

  const existingVideo = await solutionVideoRepository.findVideoByProblemId(problemId);
  if (existingVideo) {
    throw new ApiError(STATUS_CODES.CONFLICT, 'Video solution already exists for this problem');
  }

  const video = await solutionVideoRepository.createVideo({
    problemId,
    userId,
    youtubeUrl,
  });

  return video;
};

const updateVideoService = async (problemId, userId, youtubeUrl) => {
  const updateData = {
    youtubeUrl,
    userId,
  };

  const video = await solutionVideoRepository.updateVideoByProblemId(problemId, updateData);
  if (!video) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Video solution not found');
  }

  return video;
};

const deleteVideoService = async (problemId) => {
  const video = await solutionVideoRepository.deleteVideoByProblemId(problemId);
  if (!video) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Video solution not found');
  }
};

module.exports = {
  uploadVideoService,
  updateVideoService,
  deleteVideoService,
};
