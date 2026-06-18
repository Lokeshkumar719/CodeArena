const User = require('../models/user');
const { Problem } = require('../models/problem');
const Submission = require('../models/submission');
const SolutionVideo = require('../models/solutionVideo');

const asyncHandler = require('../utils/asyncHandler');

const getPlatformStats = asyncHandler(async (req, res) => {
  const [users, problems, submissions, videos] = await Promise.all([
    User.countDocuments(),
    Problem.countDocuments(),
    Submission.countDocuments(),
    SolutionVideo.countDocuments(),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      users,
      problems,
      submissions,
      videos,
    },
  });
});

module.exports = {
  getPlatformStats,
};
