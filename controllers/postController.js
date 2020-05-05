const { validationResult } = require('express-validator');
const Post = require('../models/post');

const { asyncHandler } = require('../services/asyncHanlder');

exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find();
  return res.json({
    status: 'success',
    results: posts.length,
    data: posts,
  });
});

exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post === null) {
    return res.status(404).json({ message: `Cant find ${req}` });
  }
  return res.status(200).json(post);
});

exports.createPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(422).json({ errors: errorMessages });
  }
  const { desc, lessonNum, ratings, childId, userId } = req.body;
  const post = new Post({
    desc,
    lessonNum,
    ratings,
    childId,
    userId,
  });

  const newPost = await post.save();
  return res.status(201).json({ status: 'success', data: newPost });
});

exports.updatePost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(422).json({ errors: errorMessages });
  }

  const updatedFields = req.body;
  await Post.updateOne(
    { _id: req.params.id },
    {
      $set: updatedFields,
    }
  );
  const updatedPost = await Post.findOne(req.params.id);
  return res.status(200).json({ status: 'success', data: updatedPost });
});

exports.deletePost = asyncHandler(async (req, res) => {
  await Post.findOneAndDelete({ _id: req.params.id });
  res.status(204).json({ status: 'success', data: null });
});
