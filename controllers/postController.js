const Post = require('../models/post');
const AppError = require('../utils/appError');
const { asyncHandler } = require('../utils/asyncHanlder');

exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find();
  return res.json({
    status: 'success',
    results: posts.length,
    data: posts,
  });
});

exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError(`No post with the ID ${req.originalUrl}`, 404));
  }
  res.status(200).json({ stats: 'sucess', data: { post } });
});

exports.createPost = asyncHandler(async (req, res, next) => {
  const post = await Post.create(req.body);
  return res.status(201).json({ status: 'success', data: post });
});

exports.updatePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    return next(new AppError(`No post with the ID ${req.originalUrl}`, 404));
  }
  return res.status(200).json({ status: 'success', data: post });
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    return next(new AppError(`No post with the ID ${req.originalUrl}`, 404));
  }
  res.status(204).json({ status: 'success', data: null });
});
