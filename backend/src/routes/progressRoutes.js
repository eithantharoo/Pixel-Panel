const express = require('express');
const router = express.Router();

const {
  getContinueReading,
  saveProgress,
  getProgressForStory,
} = require('../controllers/progressController');

const { protect } = require('../middleware/authMiddleware');

// Continue Reading list
router.get('/', protect, getContinueReading);

// Save reading progress
router.post('/', protect, saveProgress);

// Get progress for a specific story
router.get('/:storyId', protect, getProgressForStory);

module.exports = router;