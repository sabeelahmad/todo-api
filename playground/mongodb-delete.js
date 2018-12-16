// Connecting to mongodb using native mongodb package
const {MongoClient, ObjectID} = require('mongodb');

// Connecting to db
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    console.log('Unable to connect to database server.');
    return;
  }
  console.log('Connected to database.');
  const db = client.db('TodoApp');

  // delete many
  // db.collection('Todos').deleteMany({text: 'Eat Harrisa'}).then((result) => {
  //   console.log(result);
  // });

  // delete one
  // db.collection('Todos').deleteOne({text: 'Eat Harrisa'}).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result); // here result is the deleted document
  // });

  // client.close();
});
