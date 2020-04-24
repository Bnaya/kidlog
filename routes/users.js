const express = require("express");
const router = express.Router();
const User = require("../models/user");

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get a single user
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
router.post("/add-user", async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    children: req.body.children
    
  });
  
  try {
    console.log(req.body, 'request body')
    console.log(user);
    const newUser = await user.save();

    res.status(201).send(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//update a user
router.put("/:id", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const updatedFields = {
    firstName,
    lastName,
    email
  };
  if (password) {
    updatedFields.password = password;
  }
  try {
    const user = await User.updateOne(
      { _id: req.params.id },
      {
        $set: updatedFields,
      }
    );
    if (user === null) {
      return res.status(404).json({ message: "Cant find subscriber" });
    }
    res.status(200).send(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//update children

router.put("update-children/:id", async (req, res) => {
  const { children } = req.body;
  const updatedFields = {
    children
  };
  
  try {
    const user = await User.updateOne(
      { _id: req.params.id },
      {
        $set: req.body
      }
    );
    if (user === null) {
      return res.status(404).json({ message: "Cant find subscriber" });
    }
    res.status(200).send(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//delete a user
router.delete("/delete-user/:id", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (user === null) {
      return res.status(404).json({ message: "Cant find user" });
    }
    res.status(204).send({ message: "user deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
