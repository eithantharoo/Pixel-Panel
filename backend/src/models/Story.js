const mongoose = require('mongoose');

const VALID_GENRES = [
  'Romance', 'Mystery', 'Comedy', 'Fantasy', 'Horror',
  'Sci-Fi', 'Slice of Life', 'Historical', 'Adventure', 'Drama', 'Thriller',
];

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    cover: {
      type: String,
      required: [true, 'Cover image URL is required'],
    },
    banner: {
      type: String,
      trim: true,
      default: '',
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    genres: {
      type: [String],
      enum: VALID_GENRES,
      validate: {
        validator: (v) => v.length >= 1,
        message: 'At least one genre is required',
      },
    },
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'hiatus'],
      default: 'ongoing',
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    totalChapters: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

storySchema.virtual('trendingScore').get(function () {
  return this.views + this.rating * 100;
});

storySchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Story', storySchema);
