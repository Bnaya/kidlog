const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    firstName: {
      type: String,
      required: [true, 'Please provide your first name!'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide your last name'],
    },
    email: {
      type: String,
      unique: [true, 'This email exist in our system'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    password: { type: String, required: [true, 'Please provide a password'], minlength: 8 },
    passwordConfirm: { type:String, required: [true, 'Please confirm your passowrd']},

    children: [childSchema],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

module.exports = mongoose.model('User', userSchema);
