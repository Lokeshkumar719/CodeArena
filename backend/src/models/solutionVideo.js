const mongoose = require('mongoose');
const { Schema } = mongoose;

const videoSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'problem',
      required: true,
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },

    youtubeUrl: {
      type: String,
      required: true,
      validate: {
        validator: (url) => {
          try {
            const parsedUrl = new URL(url);

            return (
              parsedUrl.hostname === 'www.youtube.com' ||
              parsedUrl.hostname === 'youtube.com' ||
              parsedUrl.hostname === 'youtu.be'
            );
          } catch {
            return false;
          }
        },
        message: 'Invalid YouTube URL',
      },
    },
  },
  {
    timestamps: true,
  }
);

const SolutionVideo = mongoose.model('solutionVideo', videoSchema);

module.exports = SolutionVideo;
