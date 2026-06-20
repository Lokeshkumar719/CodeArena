const SolutionVideo = require('../../models/solutionVideo');

const attachVideoDetails = async (problem, problemId) => {
  const video = await SolutionVideo.findOne({
    problemId,
  });

  return {
    ...problem.toObject(),
    videoSolution: video
      ? {
          youtubeUrl: video.youtubeUrl,
        }
      : null,
  };
};

module.exports = attachVideoDetails;
