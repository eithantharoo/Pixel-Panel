const express = require('express');
const router = express.Router();
const{
	getChapters,
	getChapter,
	createChapter,
	getChapterPdf,
} = require('../controllers/chapterController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/chapters/pdf/:fileId',protect,getChapterPdf);
router.get('/stories/:storyId/chapters',getChapters);
router.get('/stories/:storyId/chapters/:num',protect,getChapter);
router.post('/stories/:storyId/chapters',protect,adminOnly,createChapter);

module.exports = router;