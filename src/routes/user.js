const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user.model')

router.route('/').get((req, res) => {
    User.find()
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err))
})

// handle request of creating new user
router.route('/create').post((req, res) => {
    // encrypt plain-text password
    const hashed = bcrypt.hashSync(req.body.password, 10);

    // create new user
    const user = new User({
        email: req.body.email,
        password: hashed
    })

    user.save()
        .then(() => res.json('User created!'))
        .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router;