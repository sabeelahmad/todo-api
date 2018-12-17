var express = require('express');
var bodyParser = require('body-parser');

var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

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

app.listen(3000, () => {
  console.log('App up on port 3000');
});

module.exports.app = app;
