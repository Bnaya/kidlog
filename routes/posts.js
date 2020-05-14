const express = require('express');

const router = express.Router();

const {
  getPost,
  createPost,
  getPosts,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { postValidation } = require('../services/validations');
//***ROUTES */

//get all posts
router.get('/', getPosts);

//get a single post
router.get('/:id', getPost);

// create a new post
router.post('/',  createPost);

//update a post
router.patch('/:id', updatePost);

//delete a post
router.delete('/:id', deletePost);

module.exports = router;
