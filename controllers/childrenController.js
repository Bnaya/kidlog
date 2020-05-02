const User = require('../models/user');
const { check, validationResult } = require('express-validator');

//Async Handles to retreive data async
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

exports.childValidation = [
  check('name')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "name"'),
  check('birthYear')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "birth year"'),
  check('gender')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "gender"'),
];

exports.getChild = async (req, res) => {

  try {
     const child = await User.find(
      { children: { $elemMatch: { _id: req.params.childId } } },
      { 'children.$': 1 }
    );

      return res.status(200).json({ status: 'success', data: child });
    
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createChild = asyncHandler (async (req, res) => {
  const { name, birthYear, gender } = req.body;
  const errors = validationResult(req);
  const newChild = {
    name: name,
    birthYear: birthYear,
    gender: gender,
  };
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  try {
    const user = await User.updateOne(
      { _id: req.params.id },
      { $push: { children: newChild } }
    );

        //data should brind the user complete
    return res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

exports.updateChild = asyncHandler (async (req, res) => {
  const { name, birthYear, gender } = req.body;
  const errors = validationResult(req);
  const updatedFields = {
    'children.$.name': name,
    'children.$.birthYear': birthYear,
    'children.$.gender': gender,
  };
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  try {
    const usersChildren = await User.updateOne(
      { 'children._id': req.params.childId },
      {
        $set: updatedFields,
      }
    );
    
    return res.status(200).send(usersChildren);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});