const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const Rating = require('../models/Rating');
const Story = require('../models/Story');

// Recomputes Story.rating/ratingCount from all Rating docs for a story.
// Ratings are stored as 1-5 stars; Story.rating stays on the app's existing
// 0-10 display scale (see MetaList/RatingBadge/MangaCard), so the average is
// doubled and rounded to one decimal.
async function recomputeStoryRating(storyId) {
  const [agg] = await Rating.aggregate([
    { $match: { story: new mongoose.Types.ObjectId(storyId) } },
    { $group: { _id: '$story', avgStars: { $avg: '$value' }, count: { $sum: 1 } } },
  ]);

  const rating = agg ? Math.round(agg.avgStars * 2 * 10) / 10 : 0;
  const ratingCount = agg ? agg.count : 0;

  await Story.findByIdAndUpdate(storyId, { rating, ratingCount });

  return { rating, ratingCount };
}

// @desc    Get the current user's rating for a story
// @route   GET /api/ratings/:storyId
// @access  Private
const getMyRating = asyncHandler(async (req, res) => {
  const rating = await Rating.findOne({ user: req.user.id, story: req.params.storyId });
  res.status(200).json({ value: rating?.value ?? null });
});

// @desc    Set (create or update) the current user's rating for a story
// @route   PUT /api/ratings/:storyId
// @access  Private
const rateStory = asyncHandler(async (req, res) => {
  const { value } = req.body;

  if (!Number.isInteger(value) || value < 1 || value > 5) {
    res.status(400);
    throw new Error('Rating must be a whole number between 1 and 5');
  }

  const story = await Story.findById(req.params.storyId);
  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  await Rating.findOneAndUpdate(
    { user: req.user.id, story: req.params.storyId },
    { value },
    { upsert: true, runValidators: true }
  );

  const { rating, ratingCount } = await recomputeStoryRating(req.params.storyId);

  res.status(200).json({ value, rating, ratingCount });
});

// @desc    Remove the current user's rating for a story
// @route   DELETE /api/ratings/:storyId
// @access  Private
const removeRating = asyncHandler(async (req, res) => {
  const existing = await Rating.findOneAndDelete({ user: req.user.id, story: req.params.storyId });

  if (!existing) {
    res.status(404);
    throw new Error('Rating not found');
  }

  const { rating, ratingCount } = await recomputeStoryRating(req.params.storyId);

  res.status(200).json({ value: null, rating, ratingCount });
});

module.exports = {
  getMyRating,
  rateStory,
  removeRating,
};
