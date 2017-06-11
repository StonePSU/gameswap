'use strict';
const Trade = require(process.cwd() + "/app/model/trades.js");
const uniqid = require('uniqid');

module.exports = {
    getTradesByRequestor: function(req, res) {
        Trades.find({requestor: req.user.username}).exec(function(err, trades) {
            if (err) throw err;
            
            if (trades.length > 0) {
                res.json({status: "Success", message: "Trades Returned", trades});
            } else {
                res.json({status: "Error", message: "No results found"});
            }
        });
    },
    
    getTradesByOwner: function(req, res) {
       Trades.find({owner: req.user.username}).exec(function(err, trades) {
           if (err) throw err;
           
           if (trades.length > 0) {
                res.json({status: "Success", message: "Trades Returned", trades});
            } else {
                res.json({status: "Error", message: "No results found"});
            }
       }) 
    },
    
    updateTradeStatus: function(req, res) {
        
    },
    
    requestNewTrade: function(req, res) {
        if (req.isAuthenticated()) {
            var user = req.user.username;
            var gameId = req.body.gameId;
            var title = req.body.name;
            
            if (user && gameId) {
                Trade.findOne({requestor: req.user.username, gameId: req.body.gameId}).exec(function(err, trade) {
                   if (err) throw err;
                   
                   if (trade) {
                        res.json({status: "Error", message: "Trade already requested"});
                   } else {
                       var now = new Date();
                       var newTrade = new Trade();
                       newTrade.tradeId = uniqid();
                       newTrade.requestor = user;
                       newTrade.title = title;
                       newTrade.dateRequested = now;
                       newTrade.tradeStatus = "Pending";
                       newTrade.save(function(err, trade) {
                           if (err) throw err;
                           
                           res.json({status: "Success", message: "Trade saved", trade});
                       })
                     
                       
                   }
                });
            } else {
                res.json({status: "Error", message: "One or more required parameters are missing"});
            }
        } else {
            res.json({status: "Error", message: "Not Authenticated"});
        }
    }
}
