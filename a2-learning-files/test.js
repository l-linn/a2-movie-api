console.log('Hello node!');
console.log('Goodbye!');
const os = require('os');
console.log(os.type());
const fs = require('fs');
fs.readFile('./file.txt', 'utf-8', (err, data) => {
  if (err) { throw err; }
  console.log('data: ', data);
});
const main = require('./main.js');
const myObject = main.myAwesomeObject;
console.log(myObject);