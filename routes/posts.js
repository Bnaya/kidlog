const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const { check, validationResult } = require("express-validator");
const authenicateUser = require("./users");

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

const postValidation = [
  check("desc")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"'),
  check("lessonNum")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "lesson number"'),
];

//get all posts
router.get(
  "/",

  asyncHandler(async (req, res) => {
    try {
      const posts = await Post.find();
      // return res.json(posts);
      return res.json({status: 'success', results: posts.length, data: posts})
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  })
);

//get a single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post === null) {
      return res.status(404).json({ message: "Cant find posts" });
    }
    res
      .status(200)
      .json({ status: "success",  data: post });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// create a new post
router.post(
  "/",
  postValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const { desc, lessonNum, ratings, childId, userId } = req.body;
    const post = new Post({
      desc,
      lessonNum,
      ratings,
      childId,
      userId,
    });

    try {
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(422).json({ errors: errorMessages });
      } else {
        const newPost = await post.save();
        return res.status(201).json({ status: "success", data: newPost});
      }
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  })
);

//update a post
router.put(
  "/:id",
  postValidation,
  asyncHandler(async (req, res) => {
    const updatedFields = ({ desc, lessonNum, ratings, childId } = req.body);
    const errors = validationResult(req);
    if (childId) {
      updatedFields.childId = childId;
    }
    try {
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(422).json({ errors: errorMessages });
      } else {
        const post = await Post.updateOne(
          { _id: req.params.id },
          {
            $set: updatedFields,
          }
        );
        if (post === null) {
          return res.status(404).json({ message: "Cant find subscriber" });
        }
        return res.status(200).json({ status: "success", data: post });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  })
);

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id });
    if (post === null) {
      return res.status(404).json({ message: "Cant find subscriber" });
    }
    res.status(204).json({ message: "post deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
