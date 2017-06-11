'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = new Schema({
    gameId: String,
    title: String,
    imageUrl: String,
    summary: String,
    inventory: {
        quantity: Number,
        trades: Number
    },
    igdb: {
        igdbId: Number
    },
    owners: [{
        username: String
    }]
});

module.exports = mongoose.model('Games', Game);