const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.movie;
const Users = Models.user;

mongoose.connect('mongodb://127.0.0.1:27017/movieappDB', {useNewUrlParser: true, useUnifiedTopology: true});

//create new user
app.post('/users/resigter', async (req, res) => {
  await Users.findOne({username: req.body.username})
  .then ((user) => {
    if(user) {
      return res.status(400).send(req.body.username + ' already exists');
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

//get all users
app.get('/users', async (req, res) => {
  await Users.find().then(users => {res.status(201).json(users);})
  .catch(err => {
    console.log(err);
    res.status(500).send('Error: ' + err);
  })
});

//get all movies
app.get('/movies', async (req, res) => {
  await Movies.find().then( movies => {
    res.status(201).json(movies);
  })
  .catch( err => {
    console.log(err);
    res.status(500).send('Error: ' + err)})
});

//get a user by username
app.get('/users/:username', async (req, res) => {
  await Users.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//get a movie by title
app.get('/movies/:title', async (req, res) => {
  await Movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//get genre by genre type - not working yet
app.get('/movies/genre/:type', async (req, res) => {
  await Movies.findOne({ 'genre.type': req.params.type })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//get director by director name

app.get('/movies/directors/:directorName', (req, res)=> {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.director.name === directorName)

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).send('Sorry, no directors found');
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


//http get method, take in a string/ endpoint, a function includes a request and a response
app.get ('/', (req, res) => {
  res.send('Hello, this is the font page of the movie app, which has not been built yet..');
});

app.listen(8080, () =>{
  console.log('app running on port 8080');
});