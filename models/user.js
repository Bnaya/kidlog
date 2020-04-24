const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  name: String,
  birthYear: Number,
  gender: String,
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  registered: { type: Date, default: Date.now },
  email: String,
  password: String,
  children: [childSchema],
});

module.exports = mongoose.model("User", userSchema);
