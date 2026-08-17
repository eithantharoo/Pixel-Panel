const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 10,
    },
    text: {
      type: String,
      trim: true,
      maxlength: [2000, 'Review cannot be more than 2000 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// One review per user per story — resubmitting updates it instead of duplicating
reviewSchema.index({ user: 1, story: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
