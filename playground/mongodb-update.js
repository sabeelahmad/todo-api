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

  // find one and update
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5c1514b03af9bded9f1fd207')
  // }, {
  //   $set: {
  //     completed: true // update ops in mongodb
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5c14f7c3ae8be01dc48d784c')
  }, {
    $set: {
      name: 'Sabeel Basharat' // update ops in mongodb
    },
    $inc : {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  // client.close();
});
