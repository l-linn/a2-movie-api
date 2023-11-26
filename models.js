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
  genre: {
    type: String,
    description: String,
    required: true
  },
  description: {type: String,required: true},
  actors: [String]
});

let userSchema = mongoose.Schema({
  username: {type: String, required: true},
  birthday: Date,
  email: {type: String, required: true},
  password: {type: String, required: true},
  favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'movie' }]
});

let movie = mongoose.model('movie', movieSchema);
let user = mongoose.model('user', userSchema);

module.exports.movie = movie;
module.exports.user = user;

