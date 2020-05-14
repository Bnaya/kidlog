const express = require('express');

const router = express.Router();

const {
  createUser,
  updateUser,
  getUser,
  getUsers,
  userSignin,
} = require('../controllers/userController');
const { signup } = require('../controllers/authController');
const { userValidation } = require('../services/validations');

//****ROUTES  */
router.post('/signup', signup);
// router.post('/sign-in', userSignin);

//Admin routes
router.get('/', getUsers);

//get a single user for account
router.get('/:id', getUser);


//update a user
router.patch('/:id', userValidation, updateUser);

module.exports = router;
