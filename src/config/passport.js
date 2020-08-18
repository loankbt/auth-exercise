const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    done(null, User.findOne({ id: id }));
});

// local strategy using email & password
passport.use(new LocalStrategy({ usernameField: 'email' },
    function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {

            if (err) {
                return done(err);
            }

            if (!user) {
                return done('Incorrect email');
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return done('Incorrect password');
            }

            return done(null, user);
        });
    }
));

// GoogleStrategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        User.findOne({ googleId: profile.id }, function (err, user) {
            if (err) {
                return (err);
            }

            if (!user) {
                let newUser = new User({
                    googleId: profile.id,
                    email: '',
                    name: profile.displayName,
                });

                newUser.save();

                return done(null, newUser);
            }

            return done(null, user);
        });
    }
));

// FacebookStrategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/api/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, done) {
        User.findOne({ facebookId: profile.id }, function (err, user) {
            if (err) {
                return (err);
            }

            if (!user) {
                let newUser = new User({
                    facebookId: profile.id,
                    email: '',
                    name: profile.displayName,
                });

                newUser.save();

                return done(null, newUser);
            }

            return done(null, user);
        });
    }
));