const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');

app.use(bodyParser.json());


let users = [];

let movies = [];


let topMovies = [
  {
    title: 'There Will Be Blood',
    director:'Paul Thomas Anderson',
    year:'2007'
  },
  {
    title: '12 Years a Slave',
    director:'Steve McQueen',
    year:'2013'
  },
  {
    title: 'In the Mood for Love',
    director:'Wong Kar-Wai',
    year:'2000'
  },
  {
    title: 'Spirited Away ',
    director:'Hayao Miyazaki',
    year:'2001'
  },
  {
    title: '24 Hour Party People ',
    director:'Michael Winterbottom ',
    year:'2002'
  },
  {
    title: 'Brokeback Mountain',
    director:'Ang Lee',
    year:'2005'
  },
  {
    title: 'Dogtooth ',
    director:'Yorgos Lanthimos',
    year:'2009'
  },
  {
    title: 'Lost in Translation',
    director:'Sofia Coppola',
    year:'2003'
  },
  {
    title: 'No Country for Old Men',
    director:'Coen Brothers',
    year:'2007'
  },
  {
    title: 'Once Upon a Time in Hollywood ',
    director:'Quentin Tarantino',
    year:'2019'
  }
];

//http get method, take in a string doe endpoint, a function includes a request and a response
app.get ('/', (req, res) => {
  res.send('Top moveis of the 21st century!');
});

app.get('/movies',(req, res) => {
  res.json(topMovies);
});

app.use(express.static('public'));

app.use((err, req, res, next)=>{
  console.error(err.stack);
  res.status(500).send('Something is broken..');
});

app.listen(8080, () =>{
  console.log('app running on port 8080');
});