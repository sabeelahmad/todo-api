const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());

// POST route for todos
app.post('/todos', (req, res) => {
  // Storing the todo to mongodb
  var todo = new Todo({
    text: req.body.text // text that comes from the post request to url
  });

  // save the todo to the model - it returns a promise
  todo.save().then((docs) => {
    // if success send created todo back
    res.send(docs);
  }, (e) => {
    // error handler - 400 status - bad request
    res.status(400).send(e);
  });
});

// GET /todos - List all todos
app.get('/todos', (req, res) => {
  // Fetch all todos from db
  Todo.find().then((todos) => {
    // Send all todos as response
    res.send({todos});
  }, (e) => {
    // Error handler - 400 status - bad request
    res.status(400).send(e);
  });
});

// GET /todos/:id - Get a particular todo
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  // Validating ID
  if(!ObjectID.isValid(id)) {
    return res.status(404).send(); // Sending an empty body and 404 status code
  }

  // Querying DB
  Todo.findById(id).then((todo) => {
    // Case - Valid ID, but not found in db
    if(!todo) {
      return res.status(404).send();
    }
    // Case - Todo found
    res.status(200).send({todo});
  }, (e) => {
    // Error handler for querying db
    res.status(404).send();
  });
});

// DELETE todos/:id - Delete a todo
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  // Validating ID
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // If ID valid query db
  Todo.findByIdAndRemove(id).then((todo) => {
    // If id valid but not in db
    if(!todo) {
      return res.status(404).send();
    }
    // if id valid and in db
    res.status(200).send({todo});
  }, (e) => {
    // if bad request
    res.status(400).send();
  });
});

// UPDATE todo route
// PATCH /todos/:id
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  // Using lodash's pick method to select properties that have been updated
  var body = _.pick(req.body, ['text', 'completed']);
  // Validating ID
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  // Checking if todo has been completed or not
  if(_.isBoolean(body.completed) && body.completed) {
    // Todo completed - update completedAt
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// POST /users
app.post('/users', (req, res) => {
  // Retrieving required fields from post request
  var body = _.pick(req.body, ['email', 'password']);
  // Creating new user
  var user = new User({
    email: body.email,
    password: body.password
  });
  // Saving to db
  user.save().then(() => {
    // Here we call method to gen token
    // this returns a promise/value which we can chain
    return user.generateAuthToken();
  }).then((token) => {
    // We use the token created to set the http response header for the user
    res.header('x-auth',token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// POST /users/login - Login a user dedicated route
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    // Check for user existing taken care by Model Method
    // User found then generate auth token
    return user.generateAuthToken().then((token) => {
      // respond with token
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});


// Private route
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(3000, () => {
  console.log('App up on port ' + 3000);
});

module.exports.app = app;
