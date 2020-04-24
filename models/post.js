const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  desc: String,
  lessonNum: { type: Number, min: 1, max: 1000 },
  ratings: { type: Number, min: 1, max: 5 },
  created: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child" },

});

module.exports = mongoose.model("Post", postSchema);
