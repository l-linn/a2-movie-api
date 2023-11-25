const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.movie;
const Users = Models.user;
mongoose.connect('mongodb://localhost:27017/movieappDB', {userNewUrlParser: true, useUnifiedTopology: true});

Movies.find({'genre.name':'drama'}).then().catch();

//create new user

app.post('/users/resigter', async (req, res) => {
  await Users.findOne({username: req.body.username})
  .then ((user) => {
    if(user) {
      return res.status(400).send(req.body.username + 'already exists');
    } else {
      Users.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        birthday: req.body.birthday
      }).then((user) =>{res.status(201).json(user)})
      .catch((err)=> {
        console.log(err);
        res.status(500).send('Error: ' + err);
      })
    }
  }).catch (err => {console.log(err);res.status(500).send('Error: ' + err)});
})


let users = [
  {
    id: 1,
    name: 'Dan',
    favouriteMovie: ["The Fountain"]//has to be an array
  }
];
let movies = [];

//LOCAL STORAGE
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
    title: 'Spirited Away',
    director:'Hayao Miyazaki',
    year:'2001'
  },
  {
    title: '24 Hour Party People',
    director:'Michael Winterbottom ',
    year:'2002'
  },
  {
    title: 'Brokeback Mountain',
    director:'Ang Lee',
    year:'2005'
  },
  {
    title: 'Dogtooth',
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
    title: 'Once Upon a Time in Hollywood',
    director:'Quentin Tarantino',
    year:'2019'
  }
];

//http get method, take in a string doe endpoint, a function includes a request and a response
app.get ('/', (req, res) => {
  res.send('Hello, this is the font page of the movie app, which has not been built yet..');
});

app.get('/top10',(req, res)=> {
  //res.send('Top moveis of the 21st century!');
  res.status(200).json(topMovies);
});
//checking if the code works with top 10 movies array
app.get('/top10/:movieName',(req, res)=> {
  const { movieName } = req.params;
  const movie = topMovies.find( movie => movie.title === movieName)

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).send('Sorry, no movies found');
  }
});

app.get('/movies',(req, res) => {
  res.status(200).send('Successful GET request retuning data on all movies');
});

app.get('/movies/:movieName', (req, res)=>{
  const { movieName } = req.params;
  const movie = movies.find( movie => movie.title === movieName)

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).send('Sorry, no movies found');
  }
});

app.get('/movies/genre/:genreName', (req, res)=> {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.genre.name === genreName)// access the property of the object

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).send('Sorry, no genre found');
  }
});

app.get('/movies/directors/:directorName', (req, res)=> {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.director.name === directorName)

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).send('Sorry, no directors found');
  }
});



//create
app.post('/users/register', (req, res)=> {
  const newUser = req.body;
  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
});

//update
app.put('/users/:userId/profile', (req, res)=> {
  const { userId } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == userId); //use two equal signs because the uuid is a number but user input will be a string

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user).send('movie added');
  } else {
    res.status(400).send('Sorry, no users found');
  }
});

app.post('/users/:userId/myfavourites', (req, res)=> {
  const { userId } = req.params;
  const movieTitle = req.body.favouriteMovie;

  let user = users.find( user => user.id == userId);
  if (user) {
    user.favouriteMovie.push(movieTitle);
    res.status(200).send(`${movieTitle} is added to My Favourites`);
  } else {
    res.status(400).send('Sorry, no users found');
  }
});

app.delete('/users/:userId/myfavourites', (req, res)=> {
  const { userId } = req.params;
  const movieTitle = req.body.favouriteMovie;

  let user = users.find( user => user.id == userId);
  if (user) {
    user.favouriteMovie = user.favouriteMovie.filter( title => title !== movieTitle);//filter out all movies that is not movieTitle
    res.status(200).send(`${movieTitle} is removed from your list!`);
  } else {
    res.status(400).send('Sorry, no users found');
  }
});

app.delete('/users/:userId/account-setting', (req, res)=> {
  const { userId } = req.params;

  let user = users.find( user => user.id == userId);
  if (user) {
    users = users.filter( user => user.id != userId);
    res.status(200).send(`${userId} is deleted!`);
  } else {
    res.status(400).send('Sorry, no users found');
  }
});

app.use(express.static('public'));

app.use((err, req, res, next)=>{
  console.error(err.stack);
  res.status(500).send('Something is broken..');
});

app.listen(8080, () =>{
  console.log('app running on port 8080');
});