const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    return next();
  }

  res.status(401);
  throw new Error('Not authorized, no token provided');
});

const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403);
  throw new Error('Access denied: Admins only');
};

module.exports = { protect, adminOnly };
