const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const auth = require("basic-auth");

//Async Handles to retreive data async
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
//AUTHENTICATE USER
const authenicateUser = asyncHandler(async (req, res, next) => {
  let message = null;

  const credentials = auth(req);

  if (credentials) {
    
    const user = await User.findOne({
      email: credentials.name,
    });

    if (user) {
      const authenticated = bcryptjs.compareSync(
        credentials.pass,
        user.password
      );

      if (authenticated) {
        req.currentUser = user;
      } else {
        message = `Authentication failure for email: ${user.email}`;
      }
    } else {
      message = `Authentication found for email ${credentials.name}`;
    }
  } else {
    message = `Auth header not found`;
  }
  if (message) {
    console.warn(message);
    res.status(401).json({ message: `Access Denied` });
  } else {
    next();
  }
});
//*****Validations*****

const userValidation = [
  check("firstName")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "first name"'),
  check("lastName")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "last name"'),
  check("email")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "email"')
    .isEmail()
    .withMessage('Please provie a valid email address for "email"'),
  check("password")
    .exists({ checkNull: true, checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage('Please  provide a value for "passowrd'),
];

//get all users only for the production
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send({ status: "success",results: users.length,  data: users});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get a single user for account
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null) {
      return res.status(404).json({ message: "Cant find subscriber" });
    }
    res.status(200).send({ status: "success", data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// create a new user
router.post(
  "/sign-up",
  userValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const { firstName, lastName, email, password, children } = req.body;
    const checkIfUserExist = await User.findOne({ email: email });

    try {
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(422).json({ errors: errorMessages });
      } else if (checkIfUserExist) {
        return res
          .status(400)
          .json({ message: "email address already exists" });
      } else {
        const hash = await bcryptjs.hash(password, 10);
        const user = new User({
          firstName,
          lastName,
          email,
          password: hash,
          children,
        });
        console.log(user);
        const newUser = await user.save();

        return res.status(201).send(newUser).end();
      }
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  })
);

//user sign-in

router.post("/sign-in", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const password = await bcryptjs.compare(req.body.password, user.password);
    if (!password) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    if (user === null) {
      return res.status(404).json({ message: "Cant find subscriber" });
    }
   return res.status(200).send(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//update a user
router.put(
  "/:id",
  userValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const { firstName, lastName, email, password } = req.body;
    const checkIfEmailExist = await User.findOne({
      $and: [{ _id: { $ne: req.params.id } }, { email: email }],
    });
    const hash = await bcrypt.hash(password, 10);
    const updatedFields = {
      firstName,
      lastName,
      email,
    };
    if (password) {
      updatedFields.password = hash;
    }

    try {
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
      } else if (checkIfEmailExist) {
        return res
          .status(400)
          .json({ message: "email address already exists with other user" });
      } else {
        const user = await User.updateOne(
          { _id: req.params.id },
          {
            $set: updatedFields,
          }
        );
        if (user === null) {
          return res.status(404).json({ message: "Cant find subscriber" });
        }
        return res.status(200).send(user);
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  })
);


module.exports = router;