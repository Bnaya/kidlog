const express = require('express');
const router = express.Router();
const { childValidation, getChild, createChild, updateChild, } = require('../controllers/childrenController');


//*****ROUTES*****

//get child
router.get('/children/:childId', getChild);

//add child  add in the future with session and cookie
router.post('/:id/children', childValidation, createChild);

//update child
router.put('/children/:childId', childValidation, updateChild);

module.exports = router;
