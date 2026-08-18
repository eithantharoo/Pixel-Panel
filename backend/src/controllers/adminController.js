const asyncHandler = require('../utils/asyncHandler');
const escapeRegex = require('../utils/escapeRegex');
const User = require('../models/User');
const Story = require('../models/Story');
const Chapter = require('../models/Chapter');
const Favorite = require('../models/Favorite');

// @desc    List users with search/filter/pagination
// @route   GET /api/admin/users?page=&limit=&search=&role=&isActive=
// @access  Private/Admin
const listUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.isActive === 'true') filter.isActive = true;
  if (req.query.isActive === 'false') filter.isActive = false;
  if (req.query.search) {
    const safe = escapeRegex(req.query.search.trim());
    filter.$or = [
      { name: { $regex: safe, $options: 'i' } },
      { email: { $regex: safe, $options: 'i' } },
    ];
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter).skip(skip).limit(limit).sort('-createdAt');

  res.json({
    users,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get a single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

// @desc    Update a user's role and/or active status
// @route   PATCH /api/admin/users/:id
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    res.status(400);
    throw new Error('You cannot modify your own admin account');
  }

  const { role, isActive } = req.body;

  if (role !== undefined && !['user', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Role must be either "user" or "admin"');
  }

  const update = {};
  if (role !== undefined) update.role = role;
  if (isActive !== undefined) update.isActive = Boolean(isActive);

  const user = await User.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    inactiveUsers,
    adminUsers,
    totalStories,
    totalChapters,
    totalFavorites,
    viewsAgg,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: false }),
    User.countDocuments({ role: 'admin' }),
    Story.countDocuments(),
    Chapter.countDocuments(),
    Favorite.countDocuments(),
    Story.aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' } } }]),
  ]);

  res.json({
    totalUsers,
    inactiveUsers,
    adminUsers,
    totalStories,
    totalChapters,
    totalFavorites,
    totalViews: viewsAgg[0]?.totalViews || 0,
  });
});

module.exports = {
  listUsers,
  getUser,
  updateUserStatus,
  getDashboardStats,
};
