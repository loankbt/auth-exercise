const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user.model')

// get all users
router.route('/users').get((req, res) => {
    User.find()
        .then(users => res.status(200).json({
            status: "OK",
            message: "Get all users successfully.",
            total: users.length,
            items: users
        }))
        .catch(err => res.status(400).json('Error: ' + err))
})

// create new user
router.route('/user').post((req, res) => {
    // encrypt plain-text password
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

module.exports = router;