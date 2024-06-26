//inport necessary libraries and modules
/**
 * @file server.js
 * @requires express
 * @requires uuid
 * @requires morgan
 * @requires fs
 * @requires mongoose
 * @requires models.js
 * @requires path
 * @requires dotenv
 * @requires express-validator
 * @requires cors
 * @requires auth.js
 * @requires passport
 * @requires passport.js
 */
const express = require('express');
const app = express();
const uuid = require('uuid');

const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator'); //destructuring-get the 'check' and 'validationResult' property of express-calidator

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

//connect mongoDB with mongoose
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.movie;
const Users = Models.user;
//mongoose.connect('mongodb://127.0.0.1:27017/movieappDB', {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(
    'mongodb+srv://lin7cb:c3lJ78n0A23nLqFp@cluster0.vkzg8pg.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

//create new user
app.post(
    '/register',
    [
        check('username', 'Username is required').isLength({ min: 5 }),
        check(
            'username',
            'Username contains non alphanumeric characters - not allowed.'
        ).isAlphanumeric(),
        check('password', 'Password is required').not().isEmpty(),
        check('email', 'Email does not appear to be valid').isEmail(),
    ],
    (req, res) => {
        // check the validation object for errors
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.password);
        Users.findOne({ username: req.body.username })
            .then((user) => {
                if (user) {
                    return res
                        .status(400)
                        .send(req.body.username + ' already exists');
                } else {
                    Users.create({
                        username: req.body.username,
                        password: hashedPassword,
                        email: req.body.email,
                        birthday: req.body.birthday,
                    })
                        .then((user) => {
                            res.status(201).json(user);
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).send('Error: ' + err);
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

//get all users
app.get(
    '/users',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.find()
            .then((users) => {
                res.status(201).json(users);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

//get all movies
app.get(
    '/movies',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Movies.find()
            .then((movies) => {
                res.status(201).json(movies);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

//get all genres - not working
app.get(
    '/movies/genre',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Movies.find()
            .then((movie) => {
                res.status(201).json(movie);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

//get a user by username
app.get(
    '/users/:username',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOne({ username: req.params.username })
            .then((user) => {
                res.json(user);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

//get a movie by title
app.get(
    '/movies/:title',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Movies.findOne({ title: req.params.title })
            .then((movie) => {
                res.json(movie);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

//get genre by genre type
app.get(
    '/movies/genre/:type',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Movies.findOne({ 'genre.type': req.params.type })
            .then((movie) => {
                res.json(movie.genre);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

//get director by director name
app.get(
    '/movies/director/:name',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Movies.findOne({ 'director.name': req.params.name })
            .then((movie) => {
                res.json(movie.director);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

//update a user's info by username
app.put(
    '/users/:username/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        //check if it's the user itself editing the info
        if (req.user.username !== req.params.username) {
            return res.status(400).send('Permission denied');
        }

        Users.findOneAndUpdate(
            { username: req.params.username },
            {
                $set: {
                    username: req.body.username,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: req.body.password,
                    email: req.body.email,
                    birthday: req.body.birthday,
                },
            },
            { new: true }
        )
            .then((updatedUser) => {
                res.json(updatedUser);
            })
            .catch((err) => {
                res.status(500).send('Error: ' + err);
            });
    }
);

//add/post a movie to a user's list
app.post(
    '/users/:username/favorites/:movieID',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndUpdate(
            { username: req.params.username },
            {
                $push: { favorites: req.params.movieID },
            },
            { new: true }
        )
            .then((updatedUser) => {
                res.json(updatedUser);
            })
            .catch((err) => {
                res.status(500).send('Error: ' + err);
            });
    }
);

//delete a movie from a user's list
app.delete(
    '/users/:username/favorites/:movieID',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndUpdate(
            { username: req.params.username },
            {
                $pull: { favorites: req.params.movieID },
            },
            { new: true }
        )
            .then((updatedUser) => {
                res.json(updatedUser);
            })
            .catch((err) => {
                res.status(500).send('Error: ' + err);
            });
    }
);

//delete a user by username
app.delete(
    '/users/:username/setting',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Users.findOneAndDelete({ username: req.params.username })
            .then((user) => {
                if (!user) {
                    res.status(400).send(req.params.username + 'not found');
                } else {
                    res.status(200).send(req.params.username + ' deleted');
                }
            })
            .catch((err) => {
                res.status(500).send('Error: ' + err);
            });
    }
);

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken..');
});

//http get method, take in a string/ endpoint, a function includes a request and a response
app.get('/', (req, res) => {
    res.send(
        'Hello, this is the font page of the movie app, which has not been built yet..'
    );
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});
