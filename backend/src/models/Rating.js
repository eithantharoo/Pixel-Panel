const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
    },
    // 1-5 stars — Story.rating is derived from this (see ratingController's
    // recomputeStoryRating) and kept on the app's existing 0-10 display scale.
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// One rating per user per story — re-rating updates this doc (see rateStory).
ratingSchema.index({ user: 1, story: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
