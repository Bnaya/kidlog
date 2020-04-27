const express = require("express");
const router = express.Router();
const Post = require("../models/post");
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
};

const postValidation = [
  check("desc")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"'),
  check("lessonNum")
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "lesson number"'),
];

//get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get a single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post === null) {
      return res.status(404).json({ message: "Cant find posts" });
    }
    res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// create a new post
router.post("/", postValidation, asyncHandler(async (req, res) => {
   const errors = validationResult(req);
  const post = new Post({
    desc: req.body.desc,
    lessonNum: req.body.lessonNum,
    ratings: req.body.ratings,
    childId: req.body.childId,
    userId: req.body.userId
  });

  try {
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(422).json({ errors: errorMessages });
    } else {

      const newPost = await post.save();
     return res.status(201).json(newPost);
    }
  } catch (err) {
   return res.status(400).json({ message: err.message });
  }
}));

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
       return res.status(200).json(post);
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
