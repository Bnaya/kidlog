const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const childSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birthYear: { type: Number, required: true },
    gender: { type: String, required: true },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: [true, 'This email exist in our system'] },
    password: { type: String, required: [true], select: false, unique: true },

    children: [childSchema],
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator, { message: 'Email already in use.' });
module.exports = mongoose.model('User', userSchema);
