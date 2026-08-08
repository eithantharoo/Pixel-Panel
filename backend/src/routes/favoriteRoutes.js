const express = require('express');
const router = express.Router();

const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require('../controllers/favoriteController');

const { protect } = require('../middleware/authMiddleware');

// Get all favorites
router.get('/', protect, getFavorites);

// Add a story to favorites
router.post('/:storyId', protect, addFavorite);

// Remove a story from favorites
router.delete('/:storyId', protect, removeFavorite);

module.exports = router;