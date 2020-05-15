const express = require('express');

const router = express.Router();

const {
    updateUser,
  getUser,
  getUsers
  
} = require('../controllers/userController');
const { signup, signin } = require('../controllers/authController');

//****ROUTES  */
router.post('/signup', signup);
router.post('/signin', signin);
// router.post('/sign-in', userSignin);

//Admin routes
router.get('/', getUsers);

//get a single user for account
router.get('/:id', getUser);


//update a user
router.patch('/:id',  updateUser);

module.exports = router;
