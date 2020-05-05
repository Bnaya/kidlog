const { check } = require('express-validator');

exports.postValidation = [
  check('desc')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"'),
  check('lessonNum')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "lesson number"'),
];

exports.childValidation = [
  check('name')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "name"'),
  check('birthYear')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "birth year"'),
  check('gender')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "gender"'),
];

exports.userValidation = [
  check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "first name"'),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "last name"'),
  check('email')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "email"')
    .isEmail()
    .withMessage('Please provie a valid email address for "email"'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage('Please  provide a value for "passowrd'),
];
