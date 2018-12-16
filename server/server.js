var express = require('express');
var bodyParser = require('body-parser');

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

app.listen(3000, () => {
  console.log('App up on port 3000');
});

module.exports.app = app;
