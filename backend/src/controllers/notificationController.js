const asyncHandler = require('../utils/asyncHandler');
const Notification = require('../models/Notification');

// @desc    List the current user's notifications
// @route   GET /api/notifications?page=&limit=
// @access  Private
const listNotifications = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { recipient: req.user.id };
  const total = await Notification.countDocuments(filter);
  const notifications = await Notification.find(filter)
    .populate('relatedStory')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.json({
    notifications,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get the current user's unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ recipient: req.user.id, read: false });
  res.json({ count });
});

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user.id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  res.json(notification);
});

// @desc    Mark all of the current user's notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user.id, read: false },
    { read: true }
  );

  res.json({ message: 'All notifications marked as read' });
});

module.exports = {
  listNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
};
