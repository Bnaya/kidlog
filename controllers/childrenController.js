const { validationResult } = require('express-validator');
const User = require('../models/user');
const { asyncHandler } = require('../services/asyncHanlder');

exports.getChild = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  const child = user.children.id(req.params.childId);

  if (!child) {
    return res.status(404).json({ message: 'Cant find child' });
  }
  return res.status(200).json({ status: 'success', data: child });
});

exports.createChild = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  const { name, birthYear, gender } = req.body;
  const newChild = {
    name: name,
    birthYear: birthYear,
    gender: gender,
  };

  await User.updateOne(
    { _id: req.params.id },
    { $push: { children: newChild } }
  );

  const updatedUser = await User.findOne({ _id: req.params.id });
  return res.status(200).json({ status: 'success', data: updatedUser });
});

exports.updateChild = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  const { name, birthYear, gender } = req.body;
  const updatedFields = {
    'children.$.name': name,
    'children.$.birthYear': birthYear,
    'children.$.gender': gender,
  };

  await User.updateOne(
    { 'children._id': req.params.childId },
    {
      $set: updatedFields,
    }
  );
  const updatedUser = await User.findOne({ _id: req.params.id });
  return res.status(200).send(updatedUser);
});

exports.deleteChild = asyncHandler(async (req, res) => {
  await User.updateOne(
    { _id: req.params.id },
    { $pull: { children: { _id: req.params.childId } } }
  );

  res.status(204).json({ status: 'success', data: null });
});
