const { redisClient } = require('../../config/redis');

const removeRefreshSession = async (userId) => {
  await redisClient.del(`refreshToken:${userId}`);
};

module.exports = removeRefreshSession;
