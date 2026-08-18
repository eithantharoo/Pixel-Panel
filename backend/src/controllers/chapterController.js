const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const Story = require('../models/Story');
const Chapter = require('../models/Chapter');
const Favorite = require('../models/Favorite');
const Notification = require('../models/Notification');
const { getPdfBucket } = require('../config/gridfs');

const PDF_MAGIC_BYTES = Buffer.from('%PDF-');

async function deletePdfIfAny(fileId) {
	if (!fileId) return;
	try {
		await getPdfBucket().delete(new mongoose.Types.ObjectId(fileId));
	} catch (error) {
		console.error('Failed to delete chapter PDF from GridFS:', error);
	}
}

const getChapters = asyncHandler(async(req,res) => {
	const storyId = req.params.storyId;
	const story = await Story.findById(
		storyId);

	if(!story){
		res.status(404);
		throw new Error('Story not found');
	}
	const chapters = await Chapter.find(
		{story: storyId,
		isPublished: true}).select('number title publishedAt').sort('number');

	res.status(200).json(chapters);

});

const getChapter = asyncHandler(async(req,res)=>{
	const storyId = req.params.storyId;
	const num = req.params.num;

	const chapter = await Chapter.findOne({
		story: storyId,
		number: num,
		isPublished: true});

	if(!chapter){
		res.status(404);
		throw new Error('Chapter not found');
	}
	res.status(200).json(chapter);

});

const createChapter = asyncHandler(async(req,res)=>{
	const story = await Story.findById(
		req.params.storyId);

	if(!story){
		res.status(404);
		throw new Error('Story not found');
	}
	const { number, title, content, contentUrl, pdfFileId, pdfFilename, pdfSize, pages } = req.body;

	let created_chapter;
	try {
		created_chapter = await Chapter.create({
			number,
			title,
			content,
			contentUrl,
			pdfFileId,
			pdfFilename,
			pdfSize,
			pages,
			story: req.params.storyId,
		});
	} catch (error) {
		if (error.code === 11000) {
			res.status(400);
			throw new Error('Chapter number already exists for this story');
		}
		throw error;
	}

	await Story.findByIdAndUpdate(req.params.storyId,
		{$inc: {totalChapters:1} } );

	try {
		const favoriters = await Favorite.find({ story: req.params.storyId }).select('user');
		if (favoriters.length) {
			await Notification.insertMany(
				favoriters.map((f) => ({
					recipient: f.user,
					type: 'new_chapter',
					title: 'New chapter',
					message: `${story.title} — Chapter ${number}: ${title}`,
					relatedStory: req.params.storyId,
					relatedChapter: created_chapter._id,
				}))
			);
		}
	} catch (error) {
		console.error('Failed to create new-chapter notifications:', error);
	}

	res.status(201).json(created_chapter);

});

// @desc    Update a chapter
// @route   PUT /api/admin/chapters/:chapterId
// @access  Private/Admin
const updateChapter = asyncHandler(async (req, res) => {
	const existing = await Chapter.findById(req.params.chapterId);
	if (!existing) {
		res.status(404);
		throw new Error('Chapter not found');
	}

	const replacingPdf =
		Object.prototype.hasOwnProperty.call(req.body, 'pdfFileId') &&
		String(existing.pdfFileId || '') !== String(req.body.pdfFileId || '');

	const chapter = await Chapter.findByIdAndUpdate(req.params.chapterId, req.body, {
		new: true,
		runValidators: true,
	});

	if (replacingPdf && existing.pdfFileId) {
		await deletePdfIfAny(existing.pdfFileId);
	}

	res.status(200).json(chapter);
});

// @desc    Delete a chapter
// @route   DELETE /api/admin/chapters/:chapterId
// @access  Private/Admin
const deleteChapter = asyncHandler(async (req, res) => {
	const chapter = await Chapter.findById(req.params.chapterId);

	if (!chapter) {
		res.status(404);
		throw new Error('Chapter not found');
	}

	await chapter.deleteOne();
	await Story.findByIdAndUpdate(chapter.story, { $inc: { totalChapters: -1 } });
	await deletePdfIfAny(chapter.pdfFileId);

	res.json({ message: 'Chapter deleted successfully' });
});

// @desc    Upload a chapter PDF to GridFS
// @route   POST /api/admin/chapters/pdf
// @access  Private/Admin
const uploadChapterPdf = asyncHandler(async (req, res) => {
	if (!req.file) {
		res.status(400);
		throw new Error('No PDF file was uploaded');
	}

	const isPdfMime = req.file.mimetype === 'application/pdf';
	const hasPdfMagicBytes = req.file.buffer.subarray(0, 5).equals(PDF_MAGIC_BYTES);
	if (!isPdfMime || !hasPdfMagicBytes) {
		res.status(400);
		throw new Error('Uploaded file is not a valid PDF');
	}

	const bucket = getPdfBucket();
	const uploadStream = bucket.openUploadStream(req.file.originalname, {
		contentType: 'application/pdf',
	});

	await new Promise((resolve, reject) => {
		uploadStream.on('error', reject);
		uploadStream.on('finish', resolve);
		uploadStream.end(req.file.buffer);
	});

	res.status(201).json({
		fileId: uploadStream.id,
		filename: req.file.originalname,
		size: req.file.buffer.length,
	});
});

// @desc    Stream a chapter PDF back to the reader
// @route   GET /api/chapters/pdf/:fileId
// @access  Private
const getChapterPdf = asyncHandler(async (req, res) => {
	let objectId;
	try {
		objectId = new mongoose.Types.ObjectId(req.params.fileId);
	} catch {
		res.status(400);
		throw new Error('Invalid file id');
	}

	const bucket = getPdfBucket();
	const files = await bucket.find({ _id: objectId }).toArray();
	if (files.length === 0) {
		res.status(404);
		throw new Error('PDF not found');
	}

	res.set('Content-Type', 'application/pdf');
	res.set('Content-Disposition', `inline; filename="${files[0].filename}"`);

	const downloadStream = bucket.openDownloadStream(objectId);
	downloadStream.on('error', () => {
		res.status(404);
		res.end();
	});
	downloadStream.pipe(res);
});

// @desc    Get all chapters for a story, including unpublished (admin)
// @route   GET /api/admin/stories/:storyId/chapters
// @access  Private/Admin
const getChaptersAdmin = asyncHandler(async (req, res) => {
	const storyId = req.params.storyId;
	const story = await Story.findById(storyId);

	if (!story) {
		res.status(404);
		throw new Error('Story not found');
	}

	const chapters = await Chapter.find({ story: storyId }).sort('number');
	res.status(200).json(chapters);
});

module.exports = {
	getChapters,
	getChapter,
	createChapter,
	updateChapter,
	deleteChapter,
	getChaptersAdmin,
	uploadChapterPdf,
	getChapterPdf,
};
	
	

