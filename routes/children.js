const express = require('express');

const router = express.Router();
const {
  getChild,
  createChild,
  updateChild,
  deleteChild,
} = require('../controllers/childrenController');

//*****ROUTES*****

//get child
router.get('/:id/children/:childId', getChild);

//add child  add in the future with session and cookie
router.post('/:id/children', createChild);

//update child
router.patch('/:id/children/:childId', updateChild);

router.delete('/:id/children/:childId', deleteChild);
module.exports = router;
