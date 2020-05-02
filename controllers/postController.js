const Post = require('../models/post');
const { check, validationResult } = require('express-validator');


//****ASYCN HANDLER */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

//***** POST VALIDATION  */
exports.postValidation = [
  check('desc')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"'),
  check('lessonNum')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "lesson number"'),
];

//***** REQUESTS AND RESPONSES FUNCTIONS */

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    return res.json({
      status: 'success',
      results: posts.length,
      data: posts,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getPost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post === null) {
      return res.status(404).json({ message: 'Cant find posts' });
    }
    res.status(200).json({ status: 'success', data: post });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

exports.createPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  const { desc, lessonNum, ratings, childId, userId } = req.body;
  const post = new Post({
    desc,
    lessonNum,
    ratings,
    childId,
    userId,
  });
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(422).json({ errors: errorMessages });
  }
  try {
    const newPost = await post.save();
    return res.status(201).json({ status: 'success', data: newPost });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

exports.updatePost = asyncHandler (async (req, res) => {
  const updatedFields = ({ desc, lessonNum, ratings, childId } = req.body);
  const errors = validationResult(req);
  if (childId) {
    updatedFields.childId = childId;
  }
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(422).json({ errors: errorMessages });
  }
  try {
    const post = await Post.updateOne(
      { _id: req.params.id },
      {
        $set: updatedFields,
      }
    );
    if (post === null) {
      return res.status(404).json({ message: 'Cant find post' });
    }
    return res.status(200).json({ status: 'success', data: post });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id });
    if (post === null) {
      return res.status(404).json({ message: 'Cant find post' });
    }
    res.status(204).json({ status: 'sucess', data: null });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
