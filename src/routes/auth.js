const router = require('express').Router()
const passport = require('passport')
const User = require('../models/user.model')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

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

// passport.use('register', new LocalStrategy(
//     {
//         usernameField: 'email',
//         passwordField: 'password'
//     },
//     (email, password, done) => {
//         try {
//             User.findOne({ email: email })
//                 .then(user => {
//                     if (user !== null) {
//                         return done(null, false, { message: 'User already existed!' });
//                     } else {
//                         bcrypt.hash(password, 10)
//                             .then(hashed => {
//                                 User.create({ email, password: hashed })
//                                     .then(user => {
//                                         return done(null, user);
//                                     });
//                             });
//                     }
//                 });
//         }
//         catch (err) {
//             done(err)
//         }
//     })
// )

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
    done(null, User.findOne({ id: id }))
})

// handle login request
router.post('/login', 
    passport.authenticate('local', { failureFlash: true }),
    (req, res) => {
        const email = req.user.email;

        const token = jwt.sign({ id: email }, process.env.TOKEN_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });

        let user = {
            id: req.user.id,
            email: email,
            token: token
        }


        res.send(user);
    },
)

// handle register request
router.post('/register', (req, res) => {
    const hashed = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        email: req.body.email,
        password: hashed
    })

    user.save()
        .then(() => res.status(201).json({
            status: "OK",
            message: "Create user successfully.",
            item: user
        }))
        .catch(err => res.status(400).json('Error: ' + err))
})

// request to test redirect after log in successfully
router.get('/', (req, res) => {
    var token = req.headers['x-access-token'];

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.TOKEN_KEY, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        res.status(200).send(decoded);
    });
})

module.exports = router;