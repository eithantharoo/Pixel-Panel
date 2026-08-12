const express = require('express');
const router = express.Router();

const {
  getContinueReading,
  getReadingHistory,
  saveProgress,
  getProgressForStory,
} = require('../controllers/progressController');

const { protect } = require('../middleware/authMiddleware');

// Continue Reading list
router.get('/', protect, getContinueReading);

// Full reading history — must come before /:storyId or it'd be swallowed
router.get('/history', protect, getReadingHistory);

// Save reading progress
router.post('/', protect, saveProgress);

// Get progress for a specific story
router.get('/:storyId', protect, getProgressForStory);

module.exports = router;