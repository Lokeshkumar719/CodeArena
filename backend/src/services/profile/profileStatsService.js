const submissionRepository = require('../../repositories/submissionRepository');

const getProfileStats = async (userId, solvedCount) => {
  const [totalSubmissions, acceptedSubmissions] = await Promise.all([
    submissionRepository.countSubmissions({
      userId,
    }),

    submissionRepository.countSubmissions({
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
