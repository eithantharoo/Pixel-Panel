const asyncHandler = require('../utils/asyncHandler');
const ReadingProgress = require('../models/ReadingProgress');


const getContinueReading = asyncHandler(async (req, res) => {
  const progress = await ReadingProgress.find({
    user: req.user.id,
    progress: { $lt: 100 },
  })
    .populate('story')
    .sort({ lastReadAt: -1 })
    .limit(5);

  res.status(200).json(progress);
});


const saveProgress = asyncHandler(async (req, res) => {
  const { storyId, chapterNumber, progress } = req.body;

  if (
    storyId === undefined ||
    chapterNumber === undefined ||
    progress === undefined
  ) {
    res.status(400);
    throw new Error('Please provide storyId, chapterNumber and progress');
  }

  const updatedProgress = await ReadingProgress.findOneAndUpdate(
    {
      user: req.user.id,
      story: storyId,
    },
    {
      chapterNumber,
      progress,
      lastReadAt: Date.now(),
    },
    {
      upsert: true,
      new: true,
    }
  );

  res.status(200).json(updatedProgress);
});


const getProgressForStory = asyncHandler(async (req, res) => {
  const progress = await ReadingProgress.findOne({
    user: req.user.id,
    story: req.params.storyId,
  });

  if (!progress) {
    return res.status(200).json({
      chapterNumber: 1,
      progress: 0,
    });
  }

  res.status(200).json(progress);
});

module.exports = {
  getContinueReading,
  saveProgress,
  getProgressForStory,
};