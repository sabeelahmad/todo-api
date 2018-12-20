const {SHA256} = require('crypto-js');

var msg = 'I am user no 3';
var hash = SHA256(msg).toString();

console.log(msg);
console.log(hash);

// We will implement token system using hashing and salting

var data = {
  id: 4
};

var token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString() // the additional part is called salting so that user can never recreate our hash
};

var resHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// cases
// if user token matches our token
if (resHash === token.hash) {
  console.log('No worries!');
} else {
  // data manipulated not secure
  console.log('SECURITY!!!');
}

// All this can be accomplished by using JWT's

const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

var token = jwt.sign(data, 'secret');
console.log(token);

var decoded = jwt.verify(token, 'secret');
console.log(decoded);
