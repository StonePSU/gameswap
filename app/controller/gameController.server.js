'use strict';
var request = require('request');
var Game = require(process.cwd() + "/app/model/games.js");
var uniqid = require('uniqid');

var notAuthenticated = {
    status: "Error",
    message: "Not Authenticated"
}

var noResults = {
    status: "Error", 
    message: "No results found."
}

module.exports = {
    searchGames: function searchGames(req, res) {
        var game = req.params.id;
        if (!game) {
            res.json({status: "Error", message: "Please enter a search term"});
        } else {
            var fields = "id,name,summary,cover.url";
            var limit = "10";
            var offset = "0";
            var search = game;
            
            var options = {
                url: process.env.IGDB_URL + "?fields=" + fields + "&limit=" + limit + "&offset=" + offset + "&search=" + search,
                headers: {
                    'X-Mashape-Key': process.env.XMASHAPEKEY
                }
            }
            
            request(options, function(err, response, body) {
               if (err) throw err;
               var games = JSON.parse(body);
               res.json({status: "Success", message: "Results Found", games});
            });
        }
    },
    
    addGame: function addGame(req, res) {
        var igdbId = parseInt(req.body.igdbId);
        if (!igdbId) {
            res.json({status: "Error", message: "A game id must be provided in the payload"});
        } else {
            Game.findOne({igdb: {igdbId: igdbId}}, function(err, game) {
                if (err) throw err;
                
                if (!game || game.length === 0) {
                    var newGame = new Game({
                        gameId: uniqid(),
                        title: req.body.name,
                        imageUrl: req.body.imageUrl,
                        inventory: {
                            quantity: 1,
                            trades: 0
                        },
                        igdb: {
                            igdbId: req.body.igdbId
                        },
                        owners: [{
                            username: req.user.username
                        }]
                    })
                    
                    newGame.save(function(err, result) {
                       if (err) throw err;
                       console.log(`Game "${req.body.name}" has been added to the catalog`);
                       res.json({status: "Success", message: "Game saved successfully", result});
                    });
                } else {
                    var foundOwner = false;
                    for (var i = 0; i < game.owners.length; i++) {
                        if (game.owners[i].username === req.user.username) {
                            foundOwner = true;
                        }
                    }
                    
                    if (!foundOwner) {
                        var newUser = {username: req.user.username};
                        game.owners.push(newUser);
                        game.inventory.quantity += 1;
                        game.save(function(err, results){
                            if (err) throw err;
                            res.json({status: "Success", message: "Add to games list"});
                        })
                    } else {
                        res.json({status: "Success", message: "Game already in list"});
                    }
                }
            })
        }
    },
    
    getGames: function getGames(req, res) {
        Game.find({'owners.username' : {$ne: req.user.username}}, {_id: false})
            .select('gameId title imageUrl')
            .exec(function(err, games) {
                if (err) throw err;

                if (!games || games.length===0) {
                    res.json(noResults);
                } else {
                    res.json({status: "Success", message: "Game returned", games})
                }
            })
    },
    
    getGamesForUser: function getGamesForUser(req,res) {
        Game.find({"owners.username": req.user.username})
            .select("gameId title imageUrl")
            .exec(function(err, games) {
                if (err) throw err;
                
                if (!games || games.length ===0) {
                    res.json(noResults);
                } else {
                    res.json({status: "Success", message: "Games Found", games});
                }
        })
        
    }
}
