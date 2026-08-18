const express = require('express');
const router = express.Router();

const { getMyRating, rateStory, removeRating } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

// Get the current user's rating for a story
router.get('/:storyId', protect, getMyRating);

// Set (create or update) the current user's rating for a story
router.put('/:storyId', protect, rateStory);

// Remove the current user's rating for a story
router.delete('/:storyId', protect, removeRating);

module.exports = router;
