const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const childSchema = new mongoose.Schema({
  name: String,
  birthYear: Number,
  gender: String,
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  registered: { type: Date, default: Date.now },
  email: { type: String, unique: true },
  password: String,
  children: [childSchema],
});

userSchema.plugin(uniqueValidator, { message: "Email already in use." });
module.exports = mongoose.model("User", userSchema);
