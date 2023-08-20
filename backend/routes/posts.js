const express = require("express");
const multer = require("multer");

const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

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
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});
const router = express.Router();

router.post("", checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/"+ req.file.filename,
    });
    post.save().then(createdPost => {
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

router.put("/:id", checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
  let imagePath = req.body.image;
  if(req.file){
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(201).json({
      message: "Post updated successfully",
    });
  });
});

router.get("", (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Posts fetched successfully",
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

router.delete("/:id", checkAuth, (req, res) => {
  Post.deleteOne({
    _id: req.params.id,
  }).then((response) => {
    res.status(200).json({
      message: "Post deleted successfully"
    });
  });
});

module.exports = router;
