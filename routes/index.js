const express = require("express");
const router = express.Router();

const User = require("./../models/user");

// GET /
router.get("/", function(req, res, next) {
  return res.render("index", { title: "Home" });
});

// GET /about
router.get("/about", function(req, res, next) {
  return res.render("about", { title: "About" });
});

// GET /contact
router.get("/contact", function(req, res, next) {
  return res.render("contact", { title: "Contact" });
});

//GET /register
router.get("/register", (req, res, next) => {
  return res.render("register", { title: "Sign Up" });
});

//POST /register
router.post("/register", (req, res, next) => {
  if (
    req.body.email &&
    req.body.name &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword
  ) {
    //confirm that passwords match
    if (req.body.password !== req.body.confirmPassword) {
      const err = new Error("Passwords do not match.");
      err.status = 400;
      return next(err);
    }

    //create user data object
    const userData = {
      email: req.body.email,
      name: req.body.name,
      favoriteBook: req.body.favoriteBook,
      password: req.body.password
    };
    //User schema's create method to insert user document to mongo
    User.create(userData, (error, user) => {
      if (error) {
        return next(error);
      } else {
        return res.redirect("/profile");
      }
    });
  } else {
    const err = new Error("All fields required");
    err.status = 400;
    return next(err);
  }
});
//GET /Login
router.get("/login", (req, res, next) => {
  return res.render("login", { title: "Login" });
});
//POST /Login
router.post("/login", (req, res, next) => {
  return res.send("Logged in");
});

module.exports = router;
