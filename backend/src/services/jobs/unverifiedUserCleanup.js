const cron = require('node-cron');
const User = require('../../models/user');

const startUnverifiedUserCleanup = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const result = await User.deleteMany({
        isVerified: false,
        createdAt: {
          $lt: cutoffDate,
        },
      });

      if (result.deletedCount > 0) {
        console.log(`[Cleanup Job] Deleted ${result.deletedCount} unverified users`);
      }
    } catch (error) {
      console.error('[Cleanup Job] Failed:', error.message);
    }
  });

  console.log('[Cleanup Job] Unverified user cleanup scheduled');
};

module.exports = startUnverifiedUserCleanup;
