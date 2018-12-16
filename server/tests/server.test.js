const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/todo');

// setting up db before any tests are run
// this runs before each test
// emptying the db before testing
beforeEach((done) => {
  Todo.remove().then(() => done());
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
      Todo.find().then((todos) => {
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
        expect(todos.length).toBe(0);
        done();
      }).catch((e) => done(e));
    })
  });
});