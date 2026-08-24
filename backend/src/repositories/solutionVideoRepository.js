const SolutionVideo = require('../models/solutionVideo');

const findVideoByProblemId = async (problemId) => {
  return await SolutionVideo.findOne({
    problemId,
  });
};

const findAllVideoProblemIds = async () => {
  return await SolutionVideo.find({}, { problemId: 1, _id: 0 }).lean();
};

const createVideo = async (videoData) => {
  return await SolutionVideo.create(videoData);
};

const updateVideoByProblemId = async (problemId, updateData) => {
  return await SolutionVideo.findOneAndUpdate({ problemId }, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteVideoByProblemId = async (problemId) => {
  return await SolutionVideo.findOneAndDelete({ problemId });
};

module.exports = {
  findVideoByProblemId,
  findAllVideoProblemIds,
  createVideo,
  updateVideoByProblemId,
  deleteVideoByProblemId,
};
