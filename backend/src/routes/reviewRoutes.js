const express = require('express');
const router = express.Router();
const {
  getReviewsForStory,
  getMyReview,
  saveReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stories/:storyId/reviews', getReviewsForStory);
router.get('/stories/:storyId/reviews/me', protect, getMyReview);
router.post('/stories/:storyId/reviews', protect, saveReview);
router.delete('/stories/:storyId/reviews', protect, deleteReview);

module.exports = router;
