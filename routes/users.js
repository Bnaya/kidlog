const express = require('express');
const router = express.Router();

const {
  createUser,
  updateUser,
  getUser,
  getUsers,
  userValidation,
  userSignin
} = require('../controllers/userController');


//****ROUTES  */

//get all users only for the production
router.get('/', getUsers);

//get a single user for account
router.get('/:id', getUser);

// create a new user
router.post('/sign-up', userValidation, createUser);

//user sign-in

router.post('/sign-in', userSignin);

//update a user
router.put('/:id', userValidation, updateUser);

module.exports = router;
