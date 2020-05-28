const express = require('express');
const childrenRouter = require('./children');

const router = express.Router();

const {
  // updateUser,
  getUser,
  getAllUsers,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userController');

const {
  signup,
  signin,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');

//****ROUTES  */

router.use('/:id/children/', childrenRouter);
//Authentication ROUTES

router.post('/signup', signup);
router.post('/signin', signin);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

//User Routes
router.use(protect);

router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.patch('/updateMyPassword', updatePassword);
router.delete('/deleteMe', deleteMe);

//Admin routes Don't forger to put restictTo and protect in production
router.get('/:id', getUser);
router.get('/', restrictTo('admin'), getAllUsers);

module.exports = router;
