const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');
const {app} = require('../server');
const {Todo} = require('../models/todo');

// setting up db before any tests are run
// this runs before each test
// emptying the db before testing

// seeding db
const todos = [{
  _id: new ObjectID(),
  text: 'Test 1'
}, {
  _id: new ObjectID(),
  text: 'Test 2'
}];

beforeEach((done) => {
  Todo.remove().then(() => {
    return Todo.insertMany(todos);
  }).then(() => {
    // Promise handler for insertMany method
    done();
  });
});

// Test block for POST /todos
describe('POST /todos', () => {
  // Using MOCHA
  it('should create a new todo', (done) => {
    // This is a async func so done arg is reqd
    var text = 'Testing todo post route';

    // Sending request using supertest lib
    request(app)
    .post('/todos')
    .send({text})
    // making assertions
    .expect(200) // status - 200 OK
    // custom assertion on the return body of the post request
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      // call end and the callback checks for errors if any
      if (err) {
        // in case error pass done with error as arg
        return done(err);
      }
      // if no errors check if todo has been inserted into Todos collection
      // inside mongodb
      Todo.find({text}).then((todos) => {
        // assertions about the todos fetched from db
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done(); // test passed
      }).catch((e) => done(e)); // catch block to catch any errors in fetching from db and then passing to done to make the test fail
    })
  });

  it('should not create todo with invalid data', (done) => {
    request(app)
    .post('/todos')
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      // assertions about db
      // no todo should be created
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    })
  });
});

// Test block for GET /todos
describe('GET /todos', () => {
  it('should list all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    // expect response to be 2 todos
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done)
  });
});

describe('GET /todos/:id', () => {
  it('should get a single todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done)
  });

  it('should send 404 back if todo not found', (done) => {
    var id = new ObjectID().toHexString();
    request(app)
    .get(`todos/${id}`)
    .expect(404)
    .end(done)
  });

  it('should send 404 back if objecid invalid', (done) => {
    request(app)
    .get('todos/123')
    .expect(404)
    .end(done)
  });
});