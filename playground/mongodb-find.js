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

  // db.collection('Todos').find().toArray().then((docs) => {
  //   console.log('Todos.');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // }); // Find all documents in Todos collection

  // find on some value
  // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
  //   console.log('Todos.');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // query by id
  // db.collection('Todos').find({
  //   _id: new ObjectID('5c14f73a6d6f991d8bf98087')
  // }).toArray().then((docs) => {
  //   console.log('Todos.');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // using count func
  db.collection('Todos').find().count().then((count) => {
    console.log('Todos:', count);
  }, (err) => {
    console.log('Unable to fetch todos', err);
  });


  // client.close();
});
