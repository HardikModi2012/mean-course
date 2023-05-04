const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // to set header
  res.setHeader("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept") // to set header
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS") // to set header
  next();
})

app.use('/api/posts',(req, res, next) => {
  const posts = [
    {id: '123', title: 'First Post', content: 'THis is coming from the server'},
    {id: '124', title: 'Second Post', content: 'THis is 2nd coming from the server'},
    {id: '125', title: 'Third Post', content: 'THis is 3rd coming from the server'},
    {id: '126', title: 'Fourth Post', content: 'THis is 4th coming from the server'},
    {id: '127', title: 'Fifth Post', content: 'THis is 5th coming from the server'},
  ]
  // console.log('This is middleware part printing');
  res.json(posts);
  res.status(200).json({
    message: 'Successfully',
    posts: posts
  });
  // next();
})
app.use((req, res, next) => {
  // next();
  res.send('HEllo from res');
})

module.exports = app;
