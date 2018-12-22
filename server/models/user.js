const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email.'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// Overriding the toJSON method
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

// Instance methods
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, '123abc').toString();
  user.tokens = user.tokens.concat([{access, token}]);
  return user.save().then(() => {
    return token;
  });
};

// Model methods
UserSchema.statics.findByToken = function (token) {
  // This function verifies token of the user and authenticates
  var User = this; // Model
  var decoded;

  try {
    decoded = jwt.verify(token, '123abc');
  } catch (e) {
    // Return a promise that always rejects
    return Promise.reject();
  }

  // Decoding successful - Find user using decoded token and send back to server.js
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

// Model method
UserSchema.statics.findByCredentials = function (email, password) {
  // Find User By Email and return the promise to server.js
  return User.findOne({email}).then((user) => {
    if (!user) {
      // If email not in db reject
      return Promise.reject();
    }
    // If user exists
    // Wrapping bycrpt in a promise - it doesnt have native support for them
    return new Promise((resolve, reject) => {
      // Compare password with hashed password
      bcrypt.compare(password, user.password, (err, res) => {
        if (err || (res === false)) {
          reject();
        } else {
          resolve(user);
        }
      });
    });
  });
}

// Mongoose middleware that will run before saving to database and
// convert the plain text pwd to a hashed + salted pwd using the
// bcrypt algorithm
UserSchema.pre('save', function(next) {
  var user = this; // bind this to user

  if (user.isModified('password')) {
    // We hash the password iff it is only modified else the
    // Program will hash the hash and break
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        // Update user pwd to hash
        user.password = hash;
        // middleware completed
        next();
      });
    });
  } else {
    // Password not modified, call next
    next();
  }
});

// User model
var User = mongoose.model('User', UserSchema);

module.exports.User = User;