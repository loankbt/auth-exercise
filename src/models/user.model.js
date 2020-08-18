const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        maxlength: 255
    },
    email: {
        type: String,
        maxlength: 255,
        trim: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 255
    }
},
    {
        strict: false,
        timestamps: true,
    })

const User = mongoose.model('User', userSchema);

module.exports = User;