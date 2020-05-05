const express = require('express');

const router = express.Router();
const {
  getChild,
  createChild,
  updateChild,
  deleteChild,
} = require('../controllers/childrenController');

const { childValidation } = require('../services/validations');

//*****ROUTES*****

//get child
router.get('/:id/children/:childId', getChild);

//add child  add in the future with session and cookie
router.post('/:id/children', childValidation, createChild);

//update child
router.put('/:id/children/:childId', childValidation, updateChild);

router.delete('/:id/children/:childId', deleteChild);
module.exports = router;
