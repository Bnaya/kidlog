const User = require('../models/user');
const { asyncHandler } = require('../utils/asyncHanlder');

exports.signup = asyncHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(200).json({
    status: 'sucess',
    data: { user: newUser },
  });
});
