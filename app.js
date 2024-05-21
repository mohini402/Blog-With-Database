//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require ("dotenv").config();
const _ = require("lodash");

const aboutContent =
"In this digital space, you'll find a diverse range of content, from personal reflections and life experiences to thought-provoking articles and informative guides. The goal is to create a community where we can engage in meaningful discussions, learn from each other, and grow together.";
const contactContent =
  "My email id : mohiniagarwal1408@gmail.com";


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect(`mongodb+srv://${process.env.EMAIL}:${process.env.PASSWORD}@cluster0.xu5sddz.mongodb.net/${process.env.DATABASE}`).then(() => {
  console.log("connected");
});

const postSchema = {
  title: String,
  content: String,
  author:String
};

const Post = mongoose.model("Post", postSchema);

let posts = [];


app.get("/", function (req, res) {
 
  Post.find({})
  .then(function(posts){
    res.render("home", {
      posts: posts
      });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});


app.get("/edit/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  Post.findById(requestedPostId).then(function (post) {
    if (post) {
      res.render("edit", {
        postId: post._id,
        title: post.title,
        content: post.content,
        author :post.author
      });
    } else {
      res.send("Post not found");
    }
  }).catch(function (err) {
    console.log(err);
    res.send("Error occurred");
  });
});

app.post("/edit/:postId", function (req, res) {
  const postId = req.params.postId;
  Post.findByIdAndUpdate(postId, {
    title: req.body.postTitle,
    content: req.body.postBody,
    author: req.body.authorName
  }).then(() => {
    console.log("Post updated successfully!");
    res.redirect("/posts/" + postId);
  }).catch(err => {
    console.log(err);
    res.send("Error occurred");
  });
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    author: req.body.authorName
  });

  post.save().then(()=>{
    console.log("Post added to DB");
    res.redirect("/");
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  Post.findById(requestedPostId).then(function (post) {
    res.render("post", {
      postId: post._id,
      title: post.title,
      content: post.content,
      author: post.author
    });
  }).catch(function (err) {
    console.log(err);
    res.send("Error occurred");
  });
});

app.post("/delete/:postId", function (req, res) {
  const postId = req.params.postId;
  Post.findByIdAndRemove(postId)
    .then(() => {
      console.log("Blog deleted successfully!");
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      res.send("Error occurred");
    });
});


  //const requestedTitle = _.lowerCase(req.params.postName);

 // posts.forEach(function (post) {
  //  const storedTitle = _.lowerCase(post.title);

    //if (storedTitle === requestedTitle) {
      //res.render("post", {
        //title: post.title,
        //content: post.content,
      //});
    //}
  //});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
