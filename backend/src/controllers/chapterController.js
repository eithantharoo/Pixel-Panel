const asyncHandler = require('../utils/asyncHandler');
const Story = require('../models/Story');
const Chapter = require('../models/Chapter');

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
	const { number, title, content, pages } = req.body;

	let created_chapter;
	try {
		created_chapter = await Chapter.create({
			number,
			title,
			content,
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
	res.status(201).json(created_chapter);

});
module.exports = {
	getChapters,
	getChapter,
	createChapter,
};
	
	

