const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const auth = require('basic-auth');
const User = require('../models/user');
const { asyncHandler } = require('../services/asyncHanlder');

exports.authenicateUser = asyncHandler(async (req, res, next) => {
  let message = null;

  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne({
      email: credentials.name,
    });

    if (user) {
      const authenticated = bcryptjs.compareSync(
        credentials.pass,
        user.password
      );

      if (authenticated) {
        req.currentUser = user;
      } else {
        message = `Authentication failure for email: ${user.email}`;
      }
    } else {
      message = `Authentication found for email ${credentials.name}`;
    }
  } else {
    message = `Auth header not found`;
  }
  if (message) {
    console.warn(message);
    res.status(401).json({ message: `Access Denied` });
  } else {
    next();
  }
});

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  return res.send({
    status: 'success',
    results: users.length,
    data: users,
  });
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user === null) {
    return res.status(404).json({ message: 'Cant find subscriber' });
  }
  res.status(200).send({ status: 'success', data: user });
});

exports.createUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(422).json({ errors: errorMessages });
  }
  const { firstName, lastName, email, password, children } = req.body;
  const existUser = await User.findOne({ email: email });
  if (existUser) {
    return res.status(400).json({ message: 'email address already exists' });
  }

  const hash = await bcryptjs.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    email,
    password: hash,
    children,
  });

  const newUser = await user.save();

  return res.status(201).send(newUser);
});

exports.userSignin = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !req.body.password) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  const password = await bcryptjs.compare(req.body.password, user.password);
  if (!password) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  return res.status(200).send(user);
});

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

  const updatedUser = await User.findOne({ _id: req.params.id });
  return res.status(200).send(updatedUser);
});
