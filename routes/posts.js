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

//ADMIN ROUTES
//in the meantime we use protect method with token, but we need an admin protect method here
router.get('/',
  protect, restrictTo('admin'),
  getPosts);

//USER ROUTES
//get all user posts posts
router.get('/myposts', getUserPosts);

//get a single post
router.get('/:id', getPost);

// create a new post
router.post('/', createPost);

//update a post
router.patch('/:id', updatePost);

//delete a post
router.delete('/:id', protect, restrictTo('admin', 'user'), deletePost);

module.exports = router;
