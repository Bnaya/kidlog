const express = require('express');

const router = express.Router();
const {
  getChild,
  createChild,
  updateChild,
  deleteChild,
} = require('../controllers/childrenController');
const { protect } = require('../controllers/authController');

//*****ROUTES*****

//get child
router.get('/:id/children/:childId', protect, getChild);

//add child  add in the future with session and cookie
router.post('/:id/children', protect, createChild);

//update child
router.patch('/:id/children/:childId', protect, updateChild);

router.delete('/:id/children/:childId', protect, deleteChild);
module.exports = router;
