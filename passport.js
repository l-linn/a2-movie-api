const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Models = require('./models.js');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcrypt');

let Users = Models.user;
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

/**
 * Local strategy for authenticating user using username and password
 * @param {string} username - The username of the user
 * @param {string} password - The password of the user
 * @param {function} callback - The callback function
 */

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        (username, password, callback) => {
            console.log(`${username} ${password}`);
            Users.findOne({ username: username })
                .then((user) => {
                    if (!user) {
                        console.log('incorrect username');
                        return callback(null, false, {
                            message: 'Incorrect username or password.',
                        });
                    }
                    if (!user.validatePassword(password)) {
                        console.log('incorrect password');
                        return callback(null, false, {
                            message: 'Incorrect password.',
                        });
                    }
                    console.log('finished');
                    return callback(null, user);
                })
                .catch((err) => {
                    if (err) {
                        console.log(err);
                        return callback(err);
                    }
                });
        }
    )
);

/**
 * JWT strategy for handling JWT
 * @param {object} jwtPayload - The payload of the JWT
 * @param {function} callback - The callback function
 */

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'your_jwt_secret',
        },
        (jwtPayload, callback) => {
            return Users.findById(jwtPayload._id)
                .then((user) => {
                    return callback(null, user);
                })
                .catch((error) => {
                    return callback(error);
                });
        }
    )
);
