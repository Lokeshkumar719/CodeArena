const solutionVideoRepository = require('../../repositories/solutionVideoRepository');

const attachVideoDetails = async (problem, problemId) => {
  const video = await solutionVideoRepository.findVideoByProblemId(problemId);

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
