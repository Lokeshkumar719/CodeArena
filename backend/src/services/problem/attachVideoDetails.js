const SolutionVideo = require('../../models/solutionVideo');

const attachVideoDetails = async (problem, problemId) => {
  const video = await SolutionVideo.findOne({
    problemId,
  });

  if (!video) {
    return problem;
  }

  return {
    ...problem.toObject(),
    secureUrl: video.secureUrl,
    thumbnailUrl: video.thumbnailUrl,
    duration: video.duration,
  };
};

module.exports = attachVideoDetails;
