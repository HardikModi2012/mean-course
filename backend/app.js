const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");

const postRouters = require("./routes/posts");
const userRouters = require("./routes/user");
const app = express();

// Representation State transfer protocol
mongoose
  .connect(
    "mongodb+srv://Hardik:mypassmongo@cluster0.ook3zgw.mongodb.net/node-angular"
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // to set header
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  ); // to set header , to allow origin header
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  ); // to allow all http methods
  next();
});

app.use("/api/posts", postRouters);
app.use("/api/user", userRouters);

// app.use('/api/posts' , (req, res, next) => {
//   res.send('Hello from res');
// })

// app.post('/api/posts', (req, res, next) => {
//   const post = '';
// });

module.exports = app;
