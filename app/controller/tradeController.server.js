'use strict';
const Trade = require(process.cwd() + "/app/model/trades.js");
const Game = require(process.cwd() + "/app/model/games.js");
const uniqid = require('uniqid');

module.exports = {
    getTradesByRequestor: function(req, res) {
        Trade.find({requestor: req.user.username}).sort({dateRequested: 1}).exec(function(err, trades) {
            if (err) throw err;
            
            if (trades.length > 0) {
                res.json({status: "Success", message: "Trades Returned", trades});
            } else {
                res.json({status: "Error", message: "No results found"});
            }
        });
    },
    
    getTradesByOwner: function(req, res) {
       Trade.find({gameOwner: req.user.username}).sort({dateRequested: 1}).exec(function(err, trades) {
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

        var user = req.user.username;
        var gameId = req.body.gameId;
        var title = req.body.name;
        
        if (user && gameId) {
            Trade.findOne({requestor: req.user.username, gameId: req.body.gameId, tradeStatus: "Pending"}).exec(function(err, trade) {
               if (err) throw err;
               
               if (trade) {
                    res.json({status: "Error", message: "Trade already requested"});
               } else {
                   var owner = '';
                   Game.findOne({gameId: gameId}).exec(function(err, game) {
                       // check to see if the requestor already owns this game
                       for (let i = 0; i < game.owners.length; i++) {
                           if (game.owners[i].username === req.user.username) {
                               owner = false;
                           }
                       }
                       // if requestor doesn't own the game, initiate a trade from the first owner found
                       if (owner==='') {
                         owner = game.owners[0].username;
                       }
                       
                      console.log(`owner: ${owner}`);
                       if (owner) {
                           var now = new Date();
                           var newTrade = new Trade();
                           newTrade.tradeId = uniqid();
                           newTrade.requestor = user;
                           newTrade.title = title;
                           newTrade.dateRequested = now;
                           newTrade.tradeStatus = "Pending";
                           newTrade.gameOwner = owner;
                           newTrade.gameId = gameId;
                           newTrade.save(function(err, trade) {
                               if (err) throw err;
                               
                               res.json({status: "Success", message: "Trade saved", trade});
                           })
                       } else {
                           res.json({status: "Error", message: "This game is already in your library"});
                       }
                   });
               }
            });
        } else {
            res.json({status: "Error", message: "One or more required parameters are missing"});
        }
        
    },
    
    deleteTrade: function(req, res) {
        
        var tradeId = req.params.tradeId;
        
        if (!tradeId) {
            res.json({status: "Error", message: "Missing required parameter tradeId"});
        } else {
            Trade.remove({tradeId: tradeId}).exec(function(err, results) {
               if (err) throw err;
               
               res.json({status: "Success", message: "Trade Deleted"})
            });
        }

    },
    
    approveTrade: function(req, res) {

        var tradeId;
        if (req.params.tradeId) {
            tradeId = req.params.tradeId;
            
            Trade.findOne({tradeId: tradeId}, function(err, trade) {
                var gameId;
                var gameOwner = '';
                
                if (err) throw err;
                
                if (trade) {
                    trade.tradeStatus = "Approved";
                    gameId = trade.gameId;
                    gameOwner = trade.gameOwner;
                    
                    trade.save(function(err, results) {
                        if (err) throw err;
                        
                        /* need to reject all other trades */
                        Trade.update({gameId: gameId, tradeStatus: "Pending", gameOwner: gameOwner}, {$set: {tradeStatus: "Rejected"}}).exec(function(err, results) {
                            res.json({status: "Success", message: "Trade has been approved", results}) ;
                            
                            /* need to remove the game owner.  If this was the only owner of the game then delete the game completely */
                            Game.findOne({gameId: gameId}).exec(function(err, game) {
                                if (err) throw err;
                                
                                if (game) {
                                    var owners = game.owners;
                                    if (owners.length === 1) {
                                        game.remove();
                                        game.save(function(err, result) {
                                          if (err) throw err;  
                                        })
                                    } else {
                                        game.owners.remove({username: gameOwner});
                                        game.save(function(err, result) {
                                            if (err) throw err;
                                        })
                                    }
                                }
                            })
                        });
                    }) 
                    
                }
            });

        } else {
            res.json({status: "Error", message: "Missing input parameter tradeId"});
        }

    },
    
    rejectTrade: function(req, res) {
        
        var tradeId;
        if (req.params.tradeId) {
            tradeId = req.params.tradeId;
            Trade.update({tradeId: tradeId, tradeStatus: "Pending"}, {$set: {tradeStatus: "Rejected"}}).exec(function(err, results) {
               res.json({status: "Success", message: "Trade has been rejected", results}) ;
            });
        } else {
            res.json({status: "Error", message: "Missing input parameter tradeId"});
        }
    }
    
    
}
