'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    username: String,
    password: String,
    name: {
        firstName: String,
        lastName: String,
        fullName: String
    },
    city: String,
    state: String
});

module.exports = mongoose.model('Users', User);