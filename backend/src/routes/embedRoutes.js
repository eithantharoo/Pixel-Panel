const express = require('express');
const router = express.Router();
const { checkEmbeddable } = require('../controllers/embedController');
const { protect } = require('../middleware/authMiddleware');

router.get('/check', protect, checkEmbeddable);

module.exports = router;
