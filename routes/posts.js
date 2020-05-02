const express = require('express');
const router = express.Router();
const authenicateUser = require('../controllers/userController');
const {getPost, createPost, getPosts, updatePost, deletePost, postValidation } = require('../controllers/postController');
//***ROUTES */

//get all posts
router.get('/', getPosts);

//get a single post
router.get('/:id', getPost);

// create a new post
router.post('/', postValidation, createPost);

//update a post
router.put('/:id', postValidation, updatePost);

//delete a post
router.delete('/:id', deletePost);

module.exports = router;
