const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      res.status(401);
      throw new Error('Not authorized, invalid or expired token');
    }

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user || req.user.isActive === false) {
      res.status(403);
      throw new Error('Account is inactive');
    }

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
