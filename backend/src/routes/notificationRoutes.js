const express = require('express');
const router = express.Router();
const {
  listNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', listNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);

module.exports = router;
