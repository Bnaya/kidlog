const User = require('../models/user');
const Post = require('../models/post');
const { asyncHandler } = require('../utils/asyncHanlder');
const AppError = require('../utils/appError');

exports.getChild = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const child = user.children.id(req.params.childId);

  if (!child) {
    return next(
      new AppError(`No child with the ID ${req.params.childId}`, 404)
    );
  }
  return res.status(200).json({ status: 'success', data: child });
});

exports.createChild = asyncHandler(async (req, res) => {
  const { name, birthYear, gender } = req.body;
  const newChild = {
    name,
    birthYear,
    gender,
  };

  const user = await User.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $push: {
        children: newChild,
      },
    },
    { new: true, runValidators: true }
  );

  return res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.updateChild = asyncHandler(async (req, res, next) => {
  const { name, birthYear, gender } = req.body;
  const updatedFields = {
    'children.$.name': name,
    'children.$.birthYear': birthYear,
    'children.$.gender': gender,
  };

  const user = await User.findOneAndUpdate(
    { 'children._id': req.params.childId },
    {
      $set: updatedFields,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    return next(new AppError(`No user with the ID ${req.originalUrl}`, 404));
  }
  res.status(200).send(user);
});

exports.deleteChild = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const child = user.children.id(req.params.childId);
  child.remove();
  user.save();
  //ADD DELETE ALL POSTS WITH DELETED CHILD
  //THIS IS PROBLEMATIC
//   UNHANDLED REJECTION! �💥 Shutting down.
// ValidationError User validation failed: passwordConfirm: Please confirm your passowrd
  // await Post.deleteMany({ childId: req.params.childId });
  
  // if (!posts) {
  //   return next(new AppError(`No posts with the childId ${req.params.chilId}`, 400));
  // }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
