const circle = require('./circle.js');
let r = 3;
console.log(`Circle with radius ${r} has
  area: ${circle.area(r)}
  circumference: ${circle.circumference(r)}`);
module.exports.myAwesomeObject = {
  a: 1,
  b: 2
};
fs = require("fs");
fs.readFile('input.txt', (err, data) => { // err is an error object and data is the contents of the file.
  if (err) {
    throw err;
  }
  console.log('File content: ' + data.toString());
});

import {Buffer} from 'buffer';
const bufs = Buffer.from([1, 2, 3, 4]);

console.log(bufs);
url = require('url');
let addr = 'http://localhost:8080/default.html?year=2017&month=february';
let q = new URL(addr, 'http://localhost:8080');
console.log(q.host); // returns 'localhost:8080'
console.log(q.pathname); // returns '/default.html'
console.log(q.search); // returns '?year=2017&month=february'