const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');
const User = require('../models/user');
const { asyncHandler } = require('../utils/asyncHanlder');


exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  return res.send({
    status: 'success',
    results: users.length,
    data: users,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError(`No user with the ID ${req.originalUrl}`, 404));
  }
  res.status(200).send({ status: 'success', data: user });
});


// exports.userSignin = asyncHandler(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (!user || !req.body.password) {
//     return res.status(401).json({ message: 'Authentication failed' });
//   }

//   const password = await bcryptjs.compare(req.body.password, user.password);
//   if (!password) {
//     return res.status(401).json({ message: 'Authentication failed' });
//   }

//   return res.status(200).send(user);
// });

exports.updateUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  const { firstName, lastName, email, password } = req.body;
  const emailExist = await User.findOne({
    $and: [{ _id: { $ne: req.params.id } }, { email: email }],
  });
  const hash = await bcryptjs.hash(password, 10);
  const updatedFields = {
    firstName,
    lastName,
    email,
  };
  if (password) {
    updatedFields.password = hash;
  }

  if (emailExist) {
    return res
      .status(400)
      .json({ message: 'email address already exists with other user' });
  }

  await User.updateOne(
    { _id: req.params.id },
    {
      $set: updatedFields,
    }
  );

  const updatedUser = await User.findById(req.params.id);
  return res.status(200).send(updatedUser);
});
