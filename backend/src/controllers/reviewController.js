const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const Review = require('../models/Review');
const Story = require('../models/Story');

async function recalculateStoryRating(storyId) {
  const [stats] = await Review.aggregate([
    { $match: { story: new mongoose.Types.ObjectId(storyId) } },
    { $group: { _id: '$story', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  await Story.findByIdAndUpdate(storyId, {
    rating: stats ? Math.round(stats.avgRating * 10) / 10 : 0,
    ratingCount: stats ? stats.count : 0,
  });
}

// @desc    List reviews for a story
// @route   GET /api/stories/:storyId/reviews
// @access  Public
const getReviewsForStory = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ story: req.params.storyId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json(reviews);
});

// @desc    Get the logged-in user's own review for a story, if any
// @route   GET /api/stories/:storyId/reviews/me
// @access  Private
const getMyReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({
    user: req.user.id,
    story: req.params.storyId,
  });

  if (!review) {
    return res.status(200).json(null);
  }

  res.status(200).json(review);
});

// @desc    Create or update the logged-in user's review for a story
// @route   POST /api/stories/:storyId/reviews
// @access  Private
const saveReview = asyncHandler(async (req, res) => {
  const { rating, text } = req.body;

  if (typeof rating !== 'number' || rating < 1 || rating > 10) {
    res.status(400);
    throw new Error('Rating must be a number between 1 and 10');
  }

  const story = await Story.findById(req.params.storyId);
  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  const review = await Review.findOneAndUpdate(
    { user: req.user.id, story: req.params.storyId },
    { rating, text: text || '' },
    { upsert: true, new: true, runValidators: true, context: 'query' }
  );

  await recalculateStoryRating(req.params.storyId);

  res.status(200).json(review);
});

// @desc    Delete the logged-in user's review for a story
// @route   DELETE /api/stories/:storyId/reviews
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOneAndDelete({
    user: req.user.id,
    story: req.params.storyId,
  });

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  await recalculateStoryRating(req.params.storyId);

  res.status(200).json({ message: 'Review removed successfully' });
});

module.exports = {
  getReviewsForStory,
  getMyReview,
  saveReview,
  deleteReview,
};
