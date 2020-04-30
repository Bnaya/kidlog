const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  desc: String,
  lessonNum: { type: Number, min: 1, max: 1000 },
  ratings: { type: Number, min: 1, max: 5 },
 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child" },

}, {timestamps: true});

module.exports = mongoose.model("Post", postSchema);
