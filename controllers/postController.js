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

exports.getUserPosts = asyncHandler(async (req, res, next) => {
  if (!req.user._id) {
    return next(
      new AppError(
        `You are not authorize to visits these posts ${req.originalUrl}`,
        403
      )
    );
  }
  const posts = await Post.find({ userId: req.user._id });
  
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

  if (String(post.userId) !== req.user.id) {
    return next(
      new AppError(
        `You are not authorize to visits this posts ${req.originalUrl}`,
        403
      )
    );
  }
  res.status(200).json({ stats: 'sucess', data: { post } });
});

exports.createPost = asyncHandler(async (req, res, next) => {
  const post = await Post.create(req.body);
  return res.status(201).json({ status: 'success', data: post });
});

exports.updatePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id);
  if (!post) {
    return next(new AppError(`No post with the ID ${req.originalUrl}`, 404));
  }

  if (String(post.userId) !== req.user.id) {
    return next(
      new AppError(
        `You are not authorize to edit this post ${req.originalUrl}`,
        403
      )
    );
  }

  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({ status: 'success', data: updatedPost });
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError(`No post with the ID ${req.originalUrl}`, 404));
  }
  if (String(post.userId) !== req.user.id) {
    return next(
      new AppError(
        `You are not authorize to delete this post ${req.originalUrl}`,
        403
      )
    );
  }
  post.remove(function (err, item) {
    if (err)
      return next(new AppError(`could not proceed deleting ${err}`, 500));
    console.log(item);
  });
  res.status(204).json({ status: 'success', data: null });
});
