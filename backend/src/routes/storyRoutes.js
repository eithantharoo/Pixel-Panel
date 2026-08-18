const express = require('express');
const router = express.Router();
const {
  getAllStories,
  getStoryById,
  getTrendingStories,
  getForYou,
  getNewReleases,
  getPopularStories,
  searchStories,
  recordStoryView,
  createStory,
  updateStory,
  deleteStory,
} = require('../controllers/storyController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes — order matters: named routes must come before /:id
router.get('/trending', getTrendingStories);
router.get('/new-releases', getNewReleases);
router.get('/popular', getPopularStories);
router.get('/search', searchStories);

// Private route — also must come before /:id
router.get('/for-you', protect, getForYou);

// Public: get all and get one — /:id must be LAST
router.get('/', getAllStories);
router.get('/:id', getStoryById);
router.post('/:id/view', recordStoryView);

// Admin routes
router.post('/', protect, adminOnly, createStory);
router.put('/:id', protect, adminOnly, updateStory);
router.delete('/:id', protect, adminOnly, deleteStory);

module.exports = router;
