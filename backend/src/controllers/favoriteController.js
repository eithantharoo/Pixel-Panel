const asyncHandler = require('../utils/asyncHandler');
const Favorite = require('../models/Favorite');
const Story = require('../models/Story');


const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user.id })
    .populate('story')
    .sort({ createdAt: -1 });

  res.status(200).json(favorites);
});


const addFavorite = asyncHandler(async (req, res) => {
  const { storyId } = req.params;

  const story = await Story.findById(storyId);

  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  try {
    const favorite = await Favorite.create({
      user: req.user.id,
      story: storyId,
    });

    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      throw new Error('Story already in favorites');
    }
    throw error;
  }
});


const removeFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOneAndDelete({
    user: req.user.id,
    story: req.params.storyId,
  });

  if (!favorite) {
    res.status(404);
    throw new Error('Favorite not found');
  }

  res.status(200).json({
    message: 'Favorite removed successfully',
  });
});

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};