const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const VALID_GENRES = [
  'Romance',
  'Mystery',
  'Comedy',
  'Fantasy',
  'Horror',
  'Sci-Fi',
  'Slice of Life',
  'Historical',
  'Adventure',
  'Drama',
  'Thriller',
];

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.email !== undefined) user.email = req.body.email;
  if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
  if (req.body.password !== undefined) user.password = req.body.password;

  await user.save();

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    interests: user.interests,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
});

const getUserInterests = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    interests: user.interests,
  });
});

const saveUserInterests = asyncHandler(async (req, res) => {
  const { interests } = req.body;

  if (!Array.isArray(interests)) {
    res.status(400);
    throw new Error('Interests must be an array');
  }

  if (interests.length < 3) {
    res.status(400);
    throw new Error('Please select at least 3 interests');
  }

  const hasInvalidGenre = interests.some(
    (interest) => !VALID_GENRES.includes(interest)
  );

  if (hasInvalidGenre) {
    res.status(400);
    throw new Error('One or more selected interests are invalid');
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.interests = interests;
  await user.save();

  res.status(200).json({
    message: 'Interests saved successfully',
    interests: user.interests,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getUserInterests,
  saveUserInterests,
};
