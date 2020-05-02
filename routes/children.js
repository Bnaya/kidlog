const express = require('express');
const router = express.Router();
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

//*****VALIDATIONS*****

const childValidation = [
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

//*****REQUEST AND RESPONSE FUNCTIONS*****
const getChild = async (req, res) => {
  try {
    const child = await User.find(
      { children: { $elemMatch: { _id: req.params.childId } } },
      { 'children.$': 1 }
    );

    if (child === null) {
      return res.status(404).json({ message: 'Cant find child' });
    }
    return res.status(200).json({ status: 'success', data: child });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createChild = async (req, res) => {
  const { name, birthYear, gender } = req.body;
  const errors = validationResult(req);
  const newChild = {
    name: name,
    birthYear: birthYear,
    gender: gender,
  };

  try {
    let user;
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    } else {
      user = await User.updateOne(
        { _id: req.params.id },
        { $push: { children: newChild } }
      );

      if (user === null) {
        return res.status(404).json({ message: 'Cant find user' });
      }
    }

    return res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateChild = async (req, res) => {
  const { name, birthYear, gender } = req.body;
  const errors = validationResult(req);
  const updatedFields = {
    'children.$.name': name,
    'children.$.birthYear': birthYear,
    'children.$.gender': gender,
  };

  try {
    let usersChildren;
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    } else {
      usersChildren = await User.updateOne(
        { 'children._id': req.params.childId },
        {
          $set: updatedFields,
        }
      );
      if (usersChildren === null) {
        return res.status(404).json({ message: 'Cant find subscriber' });
      }
    }
    return res.status(200).send(usersChildren);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
//*****ROUTES*****

//get child
router.get('/children/:childId', getChild);

//add child  add in the future with session and cookie
router.post(
  '/:id/children',
  childValidation,
  asyncHandler( createChild)
);

//update child
router.put(
  '/children/:childId',
  childValidation,
  asyncHandler(updateChild)
);




module.exports = router;
