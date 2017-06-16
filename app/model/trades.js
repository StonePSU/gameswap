'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Trade = new Schema({
    tradeId: String,
    requestor: String,
    dateRequested: Date,
    gameId: String,
    title: String,
    tradeStatus: String,
    gameOwner: String
});

module.exports = mongoose.model('Trades', Trade);