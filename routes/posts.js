const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const { check, validationResult } = require('express-validator');
const authenicateUser = require('./users');

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
const postValidation = [
  check('desc')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"'),
  check('lessonNum')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "lesson number"'),
];


//***** REQUESTS AND RESPONSES FUNCTIONS */

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    // return res.json(posts);
    return res.json({
      status: 'success',
      results: posts.length,
      data: posts,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post === null) {
      return res.status(404).json({ message: 'Cant find posts' });
    }
    res.status(200).json({ status: 'success', data: post });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createPost = async (req, res) => {
  const errors = validationResult(req);
  const { desc, lessonNum, ratings, childId, userId } = req.body;
  const post = new Post({
    desc,
    lessonNum,
    ratings,
    childId,
    userId,
  });

  try {
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(422).json({ errors: errorMessages });
    } else {
      const newPost = await post.save();
      return res.status(201).json({ status: 'success', data: newPost });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const updatePost = async (req, res) => {
  const updatedFields = ({ desc, lessonNum, ratings, childId } = req.body);
  const errors = validationResult(req);
  if (childId) {
    updatedFields.childId = childId;
  }
  try {
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(422).json({ errors: errorMessages });
    } else {
      const post = await Post.updateOne(
        { _id: req.params.id },
        {
          $set: updatedFields,
        }
      );
      if (post === null) {
        return res.status(404).json({ message: 'Cant find subscriber' });
      }
      return res.status(200).json({ status: 'success', data: post });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
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
//***ROUTES */

//get all posts
router.get(
  '/',
  asyncHandler(getPosts)
);

//get a single post
router.get('/:id', getPost);

// create a new post
router.post('/', postValidation, asyncHandler(createPost));

//update a post
router.put(
  '/:id',
  postValidation,
  asyncHandler(updatePost)
);

//delete a post
router.delete('/:id', deletePost);

module.exports = router;
