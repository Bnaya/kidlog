const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    desc: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    lessonNum: {
      type: Number,
      min: 1,
      max: 1000,
      required: [true, 'Please add a lesson number'],
    },
    ratings: { type: Number, min: 1, max: 5, default: 5 },
    // userId: { type: Number, required: [true, 'Please add userId'] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // childId: { type: Number, required: [true, 'Please add childId'] },
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child' },
    image: String,
    video: String,
    createdAt: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
