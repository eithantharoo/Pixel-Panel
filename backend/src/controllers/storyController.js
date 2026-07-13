const asyncHandler = require('../utils/asyncHandler');
const Story = require('../models/Story');

// @desc    Get all stories with filters + pagination
// @route   GET /api/stories?page=1&limit=10&genre=Fantasy&status=ongoing
// @access  Public
const getAllStories = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.genre) filter.genres = req.query.genre;
  if (req.query.status) filter.status = req.query.status;

  const total = await Story.countDocuments(filter);
  const stories = await Story.find(filter).skip(skip).limit(limit).sort('-createdAt');

  res.json({
    stories,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get single story by ID (increments view count)
// @route   GET /api/stories/:id
// @access  Public
const getStoryById = asyncHandler(async (req, res) => {
  const story = await Story.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  res.json(story);
});

// @desc    Get top 4 trending stories by views
// @route   GET /api/stories/trending
// @access  Public
const getTrendingStories = asyncHandler(async (req, res) => {
  const stories = await Story.find().sort('-views -rating').limit(4);
  res.json(stories);
});

// @desc    Get stories personalized to the user's interests
// @route   GET /api/stories/for-you
// @access  Private
const getForYou = asyncHandler(async (req, res) => {
  const { interests } = req.user;

  let stories;
  if (interests && interests.length > 0) {
    stories = await Story.find({ genres: { $in: interests } })
      .sort('-rating')
      .limit(10);
  } else {
    stories = await Story.find().sort('-rating').limit(10);
  }

  res.json(stories);
});

// @desc    Get newest stories
// @route   GET /api/stories/new-releases
// @access  Public
const getNewReleases = asyncHandler(async (req, res) => {
  const stories = await Story.find().sort('-createdAt').limit(10);
  res.json(stories);
});

// @desc    Get most popular stories by rating
// @route   GET /api/stories/popular
// @access  Public
const getPopularStories = asyncHandler(async (req, res) => {
  const stories = await Story.find().sort('-rating -ratingCount').limit(10);
  res.json(stories);
});

// @desc    Search stories by title, description, or author
// @route   GET /api/stories/search?q=demon
// @access  Public
const searchStories = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    res.status(400);
    throw new Error('Search query is required');
  }

  const stories = await Story.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } },
    ],
  }).limit(20);

  res.json(stories);
});

// @desc    Create a new story
// @route   POST /api/stories
// @access  Private/Admin
const createStory = asyncHandler(async (req, res) => {
  const story = await Story.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json(story);
});

// @desc    Update a story
// @route   PUT /api/stories/:id
// @access  Private/Admin
const updateStory = asyncHandler(async (req, res) => {
  const story = await Story.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  res.json(story);
});

// @desc    Delete a story
// @route   DELETE /api/stories/:id
// @access  Private/Admin
const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  await story.deleteOne();
  res.json({ message: 'Story deleted successfully' });
});

module.exports = {
  getAllStories,
  getStoryById,
  getTrendingStories,
  getForYou,
  getNewReleases,
  getPopularStories,
  searchStories,
  createStory,
  updateStory,
  deleteStory,
};
