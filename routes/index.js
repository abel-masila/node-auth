const express = require("express");
const router = express.Router();

const User = require("./../models/user");
const middleware = require("./../middleware");

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
router.get("/register", middleware.loggedOut, (req, res, next) => {
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
        req.session.userId = user._id;
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
router.get("/login", middleware.loggedOut, (req, res, next) => {
  return res.render("login", { title: "Login" });
});
//POST /Login
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (email && password) {
    User.authenticate(email, password, (error, user) => {
      if (error || !user) {
        const error = new Error("Wrong email or password");
        error.status = 401;
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect("/profile");
      }
    });
  } else {
    const err = new Error("Email and Password are required");
    err.status = 401;
    return next(err);
  }
});

router.get("/profile", middleware.requiresLogin, (req, res, next) => {
  User.findById(req.session.userId).exec(function(error, user) {
    if (error) {
      return next(error);
    } else {
      return res.render("profile", {
        title: "Profile",
        name: user.name,
        favorite: user.favoriteBook
      });
    }
  });
  //return res.render("profile", { title: "Profile" });
});
// GET /logout
router.get("/logout", function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});
module.exports = router;
