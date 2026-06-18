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

// explanation

// ┌──────── Minute (0-59)
// │ ┌────── Hour (0-23)
// │ │ ┌──── Day of Month (1-31)
// │ │ │ ┌── Month (1-12)
// │ │ │ │ ┌ Day of Week (0-7)
// │ │ │ │ │
// 0 * * * *

// So:

// * 0 → Run at minute 0
// * * → Every hour
// * * → Every day
// * * → Every month
// * * → Every weekday

// Meaning:

// Run once every hour at exactly HH:00.

// Examples:

// * 1:00 AM
// * 2:00 AM
// * 3:00 AM
// * …
// * 11:00 PM
