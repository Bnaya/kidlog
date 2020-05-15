const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { asyncHandler } = require('../utils/asyncHanlder');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = asyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    children: req.body.children,
  });

  const token = signToken(newUser._id);

  res.status(200).json({
    status: 'sucess',
    token,
    data: { user: newUser },
  });
});

exports.signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide correct email and password', 400));
  }
  //check if the user exist && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //if everything is ok, send token to client
  const token = signToken(user._id);

  res.status(200).json({ status: 'sucess', token });
});
