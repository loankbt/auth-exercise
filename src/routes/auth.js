const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
require('../config/passport');

// request to home page
router.get('/', (req, res) => {
    let loginToken = req.cookies['loginToken'];
    let sessionID = req.sessionID;
    console.log(sessionID);

    if (!loginToken) {
        return res.status(401).send({ message: 'No token provided.' });
    }

    if (loginToken.localeCompare(sessionID) === 0) {
        let user = {
            id: req.session.user._id,
            email: req.session.user.email
        }

        // console.log(req.session.user);

        res.status(200).send(user);
    }
})

/* authentication with email & password */
router.post('/login',
    passport.authenticate('local', { failureFlash: true }),
    (req, res) => {
        // console.log(req.session);
        // console.log(req.user);

        req.session.user = req.user;
        res.cookie('loginToken', req.sessionID, { maxAge: 30 * 60 * 1000 });

        let user = {
            id: req.user.id,
            email: req.user.email
        }

        res.send(user);
    },
)

router.post('/register', (req, res) => {
    const hashed = bcrypt.hashSync(req.body.password, 10);

    if (User.findOne({ email: req.body.email })) {
        return res.json({
            status: "Fail",
            error: 'Duplicated email.'
        });
    } else {
        const user = new User({
            email: req.body.email,
            name: req.body.email,
            password: hashed
        })

        user.save()
            .then(() => res.status(201).json({
                status: "OK",
                message: "Create user successfully.",
                user: user
            }))
            .catch(err => res.status(400).json('Error: ' + err));
    }
});
/* END authentication with email & password */

const returnOutput = (req, res) => {
    res.cookie('loginToken', req.sessionID, { maxAge: 30 * 60 * 1000 });
    req.session.user = req.user;

    res.redirect('http://localhost:3000');
};

/* authentication with google account */
router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }
    )
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/error' }),
    (req, res) => {
        returnOutput(req, res);
    }
);
/* END authentication with google account */

/* authentication with facebook account */
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/api/auth/error' }),
    (req, res) => {
        returnOutput(req, res);
    }
);
/* END authentication with google account */

router.get('/logout', (req, res) => {
    req.session.destroy();

    res.clearCookie('loginToken');
    res.send('Cookie loginToken was cleared.');
})

// for testing only
router.get('/success', (req, res) => res.send('success'));
router.get('/error', (req, res) => res.send('error'));

module.exports = router;