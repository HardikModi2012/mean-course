const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const { default: mongoose } = require('mongoose');
const app = express();
// Representation State transfer protocol
mongoose.connect("mongodb+srv://Hardik:mypassmongo@cluster0.ook3zgw.mongodb.net/node-angular?retryWrites=true").then(() => {
console.log('Connected to database');
})
.catch(()=>{
  console.log('Connection failed!');
});

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // to set header
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept") // to set header , to allow origin header
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS") // to allow all http methods
  next();
})

app.post("/api/posts", (req, res, next) => {
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

app.get("/api/posts",(req, res, next) => {
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

app.delete("/api/posts/:id", (req,res, next) =>{
  Post.deleteOne({
    _id: req.params.id
  }).then((response) => {
    res.status(200).json({
      message: 'Posts fetch successfully',
      posts: documents
    });
  })
})
// app.use('/api/posts' , (req, res, next) => {
//   res.send('Hello from res');
// })

// app.post('/api/posts', (req, res, next) => {
//   const post = '';
// });

module.exports = app;
