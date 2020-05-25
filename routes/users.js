const express = require('express');

const router = express.Router();

const {
  // updateUser,
  getUser,
  getAllUsers,
  updateMe,
  deleteMe,
} = require('../controllers/userController');

const {
  signup,
  signin,
  protect,
  // restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');

//****ROUTES  */
router.post('/signup', signup);
router.post('/signin', signin);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

//Admin routes Don't forger to put restictTo and protect in production
router.get('/', getAllUsers);

//get a single user for account only for admin restrict in production
router.get('/:id', getUser);

module.exports = router;
