const express = require("express");
const Post = require('../models/post');
const Post = require('multer');

const router = express.Router();

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  })
  console.log(post);
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
})

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  })
  Post.updateOne({_id: req.params.id}, post).then(result => {
    res.status(201).json({
      message: 'Post updated successfully'
    });
  })
})

router.get("",(req, res, next) => {
  Post.find().then((documents) =>{
    console.log("documents", documents);
    res.status(200).json({
      message: 'Posts fetch successfully',
      posts: documents
    });
  })
  // res.json(posts);
  // next();
})

router.get("/:id",(req, res, next) => {
  Post.findById(req.params.id).then((post) =>{
   if (post) {
     res.status(200).json(post);
    } else {
     res.status(404).json();
   }
  })
  // res.json(posts);
  // next();
})


router.delete("/:id", (req,res, next) =>{
  Post.deleteOne({
    _id: req.params.id
  }).then((response) => {
    res.status(200).json({
      message: 'Post delete successfully',
      posts: documents
    });
  })
})

module.exports = router;

