const express = require('express');
const router = express.Router();
const {
  listUsers,
  getUser,
  updateUserStatus,
  getDashboardStats,
} = require('../controllers/adminController');
const {
  getChaptersAdmin,
  updateChapter,
  deleteChapter,
  uploadChapterPdf,
} = require('../controllers/chapterController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadPdf } = require('../middleware/uploadMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);

router.get('/users', listUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id', updateUserStatus);

router.get('/stories/:storyId/chapters', getChaptersAdmin);
router.post('/chapters/pdf', uploadPdf.single('pdf'), uploadChapterPdf);
router.put('/chapters/:chapterId', updateChapter);
router.delete('/chapters/:chapterId', deleteChapter);

module.exports = router;
