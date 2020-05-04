const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const auth = require('basic-auth');
const { asyncHandler } = require('../asyncHanlder');


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

//*****Validations*****

exports.userValidation = [
  check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "first name"'),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "last name"'),
  check('email')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "email"')
    .isEmail()
    .withMessage('Please provie a valid email address for "email"'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage('Please  provide a value for "passowrd'),
];


//**** HANDLERS */ 

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.send({
      status: 'success',
      results: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null) {
      return res.status(404).json({ message: 'Cant find subscriber' });
    }
    res.status(200).send({ status: 'success', data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  const { firstName, lastName, email, password, children } = req.body;
  const existUser = await User.findOne({ email: email });
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(422).json({ errors: errorMessages });
  } else if (existUser) {
    return res.status(400).json({ message: 'email address already exists' });
  }
  try {
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
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

exports.userSignin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    const password = await bcryptjs.compare(req.body.password, user.password);
    if (!password) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    if (user === null) {
      return res.status(404).json({ message: 'Cant find subscriber' });
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
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
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  } else if (emailExist) {
    return res
      .status(400)
      .json({ message: 'email address already exists with other user' });
  }
  try {
    const user = await User.updateOne(
      { _id: req.params.id },
      {
        $set: updatedFields,
      }
    );
    if (user === null) {
      return res.status(404).json({ message: 'Cant find subscriber' });
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
