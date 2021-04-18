//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();
console.log(process.env.OUR_SECRET);

app.use(express.static("public"));
app.set('veiw engine', ejs);
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})


userSchema.plugin(encrypt, {secret :process.env.OUR_SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User",userSchema);

app.get("/", function(req,res){
  res.render("home.ejs");
});

app.get("/login", function(req,res){
  res.render("login.ejs");
});

app.get("/register", function(req,res){
  res.render("register.ejs");

});

app.post("/register",function(req,res){

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(!err)
    res.render("secrets.ejs");
    else
    console.log(err);
  });

  //console.log(req.body);
});

app.post("/login", function(req,res){
  //const username = req.
  console.log(req.body.username);
  console.log(req.body.password);
  User.findOne({ email: req.body.username}, function(err,foundUser){
    if(err)
    console.log(err);

    if(foundUser)
    {

      if(foundUser.password === req.body.password )
      {
          console.log(foundUser);
        res.render("secrets.ejs");
      }
    }
  })
});


app.listen(3000, function(req,res){
  console.log("server is up and running on port 3000");
})
