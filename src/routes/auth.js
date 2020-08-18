const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
require('../config/passport');

// request to home page
router.get('/', (req, res) => {
    if (!req.cookies['loginToken'] || !req.sessionID) {
        return res.status(401).send({
            status: "Fail",
            message: 'No loginToken or sessionID provided'
        });
    }

    if (req.cookies['loginToken'].localeCompare(req.sessionID) === 0) {
        let user = {
            id: req.session.user._id,
            name: req.session.user.name
        }

        return res.status(200).send({
            status: "OK",
            message: "User has been authenticated",
            user: user
        });
    } else {
        return res.status(401).send({
            status: "Fail",
            message: "Authentication details mismatch"
        });
    }
})

/* authentication with email & password */
router.post('/login',
    passport.authenticate('local'),
    (req, res) => {
        req.session.user = req.user;
        res.cookie('loginToken', req.sessionID, { maxAge: 30 * 60 * 1000 });

        let user = {
            id: req.user.id,
            email: req.user.email
        }

        res.status(200).send({
            status: "OK",
            message: "Authenticate successfully",
            user: user
        });
    },
)

router.post('/register', (req, res) => {

    User.findOne({ email: req.body.email }, (error, user) => {
        if (user) {
            return res.json({
                status: "Fail",
                message: "Duplicated email"
            });
        }
    });

    const user = new User({
        email: req.body.email,
        name: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    })

    user.save()
        .then(() => res.status(201).json({
            status: "OK",
            message: "Create user successfully.",
            user: user
        }))
        .catch(err => res.status(400).json('Error: ' + err));
});
/* END authentication with email & password */

const setCookieAndStoreSession = (req, res) => {
    res.cookie('loginToken', req.sessionID, { maxAge: 30 * 60 * 1000 });
    req.session.user = req.user;

    res.redirect('http://localhost:3000');
};

/* authentication with google account */
router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/error' }),
    (req, res) => {
        setCookieAndStoreSession(req, res);
    }
);
/* END authentication with google account */

/* authentication with facebook account */
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/api/auth/error' }),
    (req, res) => {
        setCookieAndStoreSession(req, res);
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