const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

const {
  getPost,
  createPost,
  getUserPosts,
  updatePost,
  deletePost,
  getPosts,
} = require('../controllers/postController');

//***ROUTES */

//USER ROUTES
router.use(protect);
//get all user posts posts
router.get('/myposts', getUserPosts);

//get a single post
router.get('/:id', getPost);

// create a new post
router.post('/', createPost);

//update a post
router.patch('/:id', updatePost);

//delete a post
router.delete('/:id', deletePost);

router.get('/', restrictTo('admin'), getPosts);

module.exports = router;
