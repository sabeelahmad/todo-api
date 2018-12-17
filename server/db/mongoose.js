const mongoose = require('mongoose');

// Telling mongoose to use built in promise library for usage of ES6 promises.
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose,
};