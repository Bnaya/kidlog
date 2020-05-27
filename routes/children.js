const express = require('express');

const router = express.Router({ mergeParams: true });
const {
  getChild,
  createChild,
  updateChild,
  deleteChild,
} = require('../controllers/childrenController');
const { protect } = require('../controllers/authController');

//*****ROUTES*****

//get child
router.get('/:childId', protect, getChild);

//add child  add in the future with session and cookie
router.post('/', protect, createChild);

//update child
router.patch('/:childId', protect, updateChild);

router.delete('/:childId', protect, deleteChild);
module.exports = router;
