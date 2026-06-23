const Submission = require('../../models/submission');

const getProfileStats = async (userId, solvedCount) => {
  const [totalSubmissions, acceptedSubmissions] = await Promise.all([
    Submission.countDocuments({
      userId,
    }),

    Submission.countDocuments({
      userId,
      status: 'accepted',
    }),
  ]);

  const acceptanceRate =
    totalSubmissions === 0
      ? 0
      : Number(((acceptedSubmissions * 100) / totalSubmissions).toFixed(2));

  return {
    problemsSolved: solvedCount,
    totalSubmissions,
    acceptedSubmissions,
    acceptanceRate,
  };
};

module.exports = {
  getProfileStats,
};
