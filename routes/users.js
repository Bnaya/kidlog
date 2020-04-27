const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

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
    .withMessage('Please  provide a value for "passowrd'),
];

const childValidation = [
  check("name")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "name"'),
  check("birthYear")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "birth year"'),
  check("gender")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "gender"'),
];

//get all users only for the production
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
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
    res.status(200).send(user);
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
        return res.status(400).json({ errors: errorMessages });
      } else if (checkIfUserExist) {
        return res
          .status(400)
          .json({ message: "email address already exists" });
      } else {
        const hash = await bcrypt.hash(password, 10);
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
    const password = await bcrypt.compare(req.body.password, user.password);
    if (!password) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    if (user === null) {
      return res.status(404).json({ message: "Cant find subscriber" });
    }
    res.status(200).send(user);
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

//add child in the future with session and cookie
// db.students.update({ _id: 1 }, { $push: { scores: 89 } });
router.post(
  "/add-child/:id",
  childValidation,
  asyncHandler(async (req, res) => {
    const { name, birthYear, gender } = req.body;
    const errors = validationResult(req);
    const newChild = {
      name: name,
      birthYear: birthYear,
      gender: gender,
    };

    try {
      let user;
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
      } else {
         user = await User.updateOne(
          { _id: req.params.id },
          { $push: { children: newChild } }
        );

        if (user === null) {
          return res.status(404).json({ message: "Cant find user" });
        }
      }

      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  })
);

//get child
router.get("/child/:childId", async (req, res) => {
  try {
    const child = await User.find(
      { children: { $elemMatch: { _id: req.params.childId } } },
      { "children.$": 1 }
    );

    if (child === null) {
      return res.status(404).json({ message: "Cant find child" });
    }
    return res.status(200).send(child);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//update child

router.put("/update-child/:childId", async (req, res) => {
  const { name, birthYear, gender } = req.body;
  const updatedFields = {
    "children.$.name": name,
    "children.$.birthYear": birthYear,
    "children.$.gender": gender,
  };

  try {
    const usersChildren = await User.updateOne(
      { "children._id": req.params.childId },
      {
        $set: updatedFields,
      }
    );
    if (usersChildren === null) {
      return res.status(404).json({ message: "Cant find subscriber" });
    }
    res.status(200).send(usersChildren);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
