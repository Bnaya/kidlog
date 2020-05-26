const User = require('../models/user');

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

  if (child.active === false) {
    return next(new AppError('This child have been cancelled', 400));
  }

  if (String(user._id) !== req.user.id) {
    return next(
      new AppError(
        `You are not authorize to visits this page ${req.originalUrl}`,
        403
      )
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
  const user = await User.findById(req.user.id);
  const child = user.children.id(req.params.childId);

  if (!child) {
    return next(
      new AppError(`No child with the ID ${req.params.childId}`, 404)
    );
  }

  if (child.active === false) {
    return next(
      new AppError(
        'This child have been cancelled, please connect the administrator',
        400
      )
    );
  }

  if (!user) {
    return next(new AppError(`No user with the ID ${req.originalUrl}`, 404));
  }

  if (String(user._id) !== req.user.id) {
    return next(
      new AppError(
        `You are not authorize to visits this page ${req.originalUrl}`,
        403
      )
    );
  }

  const updatedUser = await User.findOneAndUpdate(
    { 'children._id': req.params.childId },
    {
      $set: updatedFields,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).send(updatedUser);
});

exports.deleteChild = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { 'children._id': req.params.childId },
    {
      $set: { active: false },
    }
  );
  if (!user) {
    return next(new AppError(`No user with the ID ${req.originalUrl}`, 404));
  }
  if (String(user._id) !== req.user.id) {
    return next(
      new AppError(
        `You are not authorize to visits this page ${req.originalUrl}`,
        403
      )
    );
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
