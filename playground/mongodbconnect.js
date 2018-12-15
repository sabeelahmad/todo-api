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

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     console.log('Error occurred');
  //     return;
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Sabeel Ahmad',
  //   age: 19,
  //   location: 'Srinagar'
  // }, (err, result) => {
  //   if (err) {
  //     console.log('Error occurred');
  //     return;
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  client.close();
});
