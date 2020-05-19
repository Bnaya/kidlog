const express = require('express');

const router = express.Router();

const {
  updateUser,
  getUser,
  getUsers,
} = require('../controllers/userController');

const {
  signup,
  signin,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

//****ROUTES  */
router.post('/signup', signup);
router.post('/signin', signin);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

//Admin routes
router.get('/', protect, restrictTo('admin'), getUsers);

//get a single user for account
router.get('/:id', getUser);

//update a user
router.patch('/:id', updateUser);

module.exports = router;
