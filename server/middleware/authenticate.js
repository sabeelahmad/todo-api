const {User} = require('../models/user');

// Authentication middleware
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');
  User.findByToken(token).then((user) => {
    if (!user) {
      // Run the catch block
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e) =>{
     res.status(401).send();
  });
};

module.exports.authenticate = authenticate;