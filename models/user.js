const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

//Authenticate input against db document
userSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email }).exec((err, user) => {
    if (err) {
      return callback(err);
    } else if (!user) {
      const error = new Error("User not found");
      error.status = 401;
      return callback(error);
    }
    bcrypt.compare(password, user.password, function(error, results) {
      if (results === true) {
        return callback(null, user);
      } else {
        return callback(error);
      }
    });
  });
};
//hash password before save
userSchema.pre("save", function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model("User", userSchema);
module.exports = User;
