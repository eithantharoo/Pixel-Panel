const mongoose = require('mongoose')

const chapterSchema = new mongoose.Schema(
    {
        story:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Story',
            required: [true,'Story is required'],
        },
        number:{
            type: Number,
            required: [true,'Chapter number is required'],
        },
        title:{
            type: String,
            required: [true,'Title is required'],
            trim: true,
        },
        content:{
            type: String,
            default: '',
        },
        pages:{
            type: [String],
            default: [],
        },
        isPublished:{
            type: Boolean,
            default: true,
        },
        publishedAt:{
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,

    }
);

chapterSchema.index({story: 1,number: 1},{unique: true});

module.exports = mongoose.model('Chapter',chapterSchema);