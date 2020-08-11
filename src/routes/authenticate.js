const router = require('express').Router()
const passport = require('passport')
const User = require('../models/user.model')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')

passport.use(new LocalStrategy({ usernameField: 'email' },
    function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {

            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        });
    }
))

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
    done(null, User.findOne({ id: id }))
})

// handle login request
router.route('/login').post(
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/er'
    }),
)

// request to test redirect after log in successfully
router.route('/').get((req, res) => {
    User.find()
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router;