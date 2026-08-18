const express = require('express');
const router = express.Router();

const {
  getContinueReading,
  getReadingHistory,
  saveProgress,
  getProgressForStory,
  deleteProgress,
  clearReadingHistory,
} = require('../controllers/progressController');

const { protect } = require('../middleware/authMiddleware');

// Continue Reading list
router.get('/', protect, getContinueReading);

// Full reading history — must come before /:storyId or it'd be swallowed
router.get('/history', protect, getReadingHistory);

// Save reading progress
router.post('/', protect, saveProgress);

// Clear all reading history for the current user
router.delete('/', protect, clearReadingHistory);

// Get progress for a specific story
router.get('/:storyId', protect, getProgressForStory);

// Remove a single story's reading progress
router.delete('/:storyId', protect, deleteProgress);

module.exports = router;