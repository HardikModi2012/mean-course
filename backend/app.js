const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const { default: mongoose } = require('mongoose');
const app = express();

mongoose.connect("mongodb+srv://Hardik:<password>@cluster0.ook3zgw.mongodb.net/").then(() => {
console.log('Connected to database');
})
.catch(()=>{
  console.log('Connection failed!');

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  res.status(201).json({
    message: 'Post added successfully',
    posts: posts
  });
})

app.use('/api/posts',(req, res, next) => {
  const posts = [
    {id: '123', title: 'First Post', content: 'This is coming from the server'},
    {id: '124', title: 'Second Post', content: 'This is coming from  the 2nd server'},
    {id: '125', title: 'Third Post', content: 'This is coming from the 3rd server'},
    {id: '126', title: 'Fourth Post', content: 'This is coming from the 4th server'},
    {id: '127', title: 'Fifth Post', content: 'This is coming from the 5th server'},
  ]// console.log('This is middleware part printing');
  res.json(posts);
  res.status(200).json({
    message: 'Post fetch successfully',
    posts: posts
  });
  // next();
})
app.use('/api/posts' , (req, res, next) => {
  res.send('Hello from res');
})

app.post('/api/posts', (req, res, next) => {
  const post = '';
});

module.exports = app;