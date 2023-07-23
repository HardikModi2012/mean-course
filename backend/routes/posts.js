const express = require("express");
const Post = require("../models/post");
const multer = require("multer");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});
const router = express.Router();

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/"+ req.file.filename,
    });
    Post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        // postId: createdPost._id
        post: {
          ...createdPost, // this will copy object of createdPost
          id: createdPost._id,
          // title: createdPost.title,
          // content: createdPost.content,
          // imagePath: createdPost.imagePath
        }
      });
    })
  }
);

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(201).json({
      message: "Post updated successfully",
    });
  });
});

router.get("", (req, res, next) => {
  Post.find().then((documents) => {
    console.log("documents", documents);
    res.status(200).json({
      message: "Posts fetch successfully",
      posts: documents,
    });
  });
  // res.json(posts);
  // next();
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json();
    }
  });
});

router.delete("/:id", (req, res) => {
  Post.deleteOne({
    _id: req.params.id,
  }).then((response) => {
    res.status(200).json({
      message: "Post delete successfully",
      posts: documents,
    });
  });
});

module.exports = router;
