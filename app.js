//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require('dotenv').config()

const homeStartingContent = "A diary is a record (originally in handwritten format) with discrete entries arranged by date reporting on what has happened over the course of a day or other period. A personal diary may include a person's experiences, thoughts, and/or feelings, excluding comments on current events outside the writer's direct experience. Someone who keeps a diary is known as a diarist";
const aboutContent = "This app was created by SHAILESH BISHT for learning and practice purpose .";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



//mongoose connect

mongoose.connect(process.env.DB_URL,{useNewUrlParser: true , useUnifiedTopology: true});

// mongoose Schema

const postSchema = new mongoose.Schema({
  title : String,
  content : String
});

// mongoose model

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){

  Post.find({},function(err , posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  //console.log(post);
  post.save(function(err){

  if (!err){

      res.redirect("/");

    }else{
      res.redirect("/");
    }
  });

});

app.get("/posts/:postID", function(req, res){
  const requestedTitle = req.params.postID;

  Post.findById(requestedTitle , function(err,post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.get("/delete/:postID",(req,res)=>{
  const requestedTitle = req.params.postID;

  Post.deleteOne({_id:requestedTitle},function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
