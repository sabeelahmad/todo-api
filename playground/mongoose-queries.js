// ObjectID from native lib
const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');

var id = '5c1656ce67c76552ced4c779';

// Different ways to query in mongoose
Todo.find({
  _id: id // Perfectly valid since mongoose casts string to objectid
}).then((todos) => {
  console.log('Todos', todos);
});

Todo.findOne({
  _id: id // Perfectly valid since mongoose casts string to objectid
}).then((todo) => {
  console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
  // If id was invalid
  if (!todo) {
    return console.log('id not found');
  }
  console.log('Todo', todo);
}).catch((e) => console.log(e));


