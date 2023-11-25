const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  title: {type: String,required: true},
  releaseYear: Number,
  director: {
    name: String,
    bio: String,
    country: String,
    birthYear: Number,
    deathYear: Number
  },
  description: {type: String,required: true},
  genre: {
    type: String,
    description: String
  },
  Actors: [String],
  imgaePath: String,
  featured: Boolean
});

let userSchema = mongoose.Schema({
  username: {type: String, required: true},
  firstName: String,
  lastName: String,
  birthday: Date,
  email: {type: String, required: true},
  password: {type: String, required: true},
  favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'movie' }]
});

let movie = mongoose.model('movie', movieSchema);
let user = mongoose.model('user', userSchema);

module.exports.movie = movie;
module.exports.user = user;

