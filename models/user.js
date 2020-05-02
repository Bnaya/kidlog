const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const childSchema = new mongoose.Schema(
  {
    name: String,
    birthYear: Number,
    gender: String,
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    children: [childSchema],
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator, { message: 'Email already in use.' });
module.exports = mongoose.model('User', userSchema);
