const express = require('express');
const {
  getProfile,
  updateProfile,
  getUserInterests,
  saveUserInterests,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/profile').get(getProfile).put(updateProfile);
router.route('/interests').get(getUserInterests).put(saveUserInterests);

module.exports = router;
