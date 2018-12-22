const mongoose = require('mongoose');

// Todo model
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true, // validator
    minlength: 1, // validator
    trim: true, // remove leading and trailing spaces
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
  // Associating a todo with a user
  _creator: {
    type: mongoose.Schema.Types.ObjectId, // The id of the user
    required: true // No todo can be created without authentication first
  }
});

module.exports.Todo = Todo;