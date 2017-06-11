'use strict';
var User = require(process.cwd() + "/app/model/users.js");
var userController = require(process.cwd() + "/app/controller/userController.server.js");
var gameController = require(process.cwd() + "/app/controller/gameController.server.js");
var tradeController = require(process.cwd() + "/app/controller/tradeController.server.js");

function routes(app, passport) {
    /* Routes */
    app.get("/", function(req, res) {
       //res.send("<h1>GameSwap</h1>");
       res.render('index');
    });
    
    app.route("/api/user")
        .post(userController.createUser)
        .patch(userController.updateUser);
        
    app.route("/api/user/:id")
        .get(userController.getUserDetails);
        
    app.route("/api/games/user/")
        .get(gameController.getGamesForUser)
        
    app.route("/api/games/:id")
        .get(gameController.searchGames);
    
    app.route("/api/games")
        .post(gameController.addGame)
        .get(gameController.getGames);
        
    app.route("/api/trades/requestor")
        .get(tradeController.getTradesByRequestor);
        
    app.route("/api/trades/owner")
        .get(tradeController.getTradesByOwner);
        
    app.route("/api/trades")
        .post(tradeController.requestNewTrade);
    
    app.route("/login")
        .post(passport.authenticate('local', {successRedirect: "/game-catalog", failureRedirect: "/login"}))
        .get(function(req, res) {
            res.render("login");
        })
        
    app.route("/create-account")
        .get(function(req, res) {
            res.render('create-account')
        })
    
    app.route("/game-catalog")
        .get(function(req, res) {
            if (req.isAuthenticated()) {
                res.render("game-catalog");
            } else {
                res.redirect("/");
            }
        })
        
    app.route("/my-games")
        .get(function(req, res) {
            if (req.isAuthenticated()) {
                res.render("my-games");
            } else {
                res.redirect("/");
            }
        })
    
    app.route("/logout")
        .get(function(req, res) {
            req.logout();
            res.redirect("/");
        })
        
    app.route("/add-games")
        .get(function(req, res) {
            if (req.isAuthenticated()) {
                res.render("add-games");
            } else {
                res.redirect("/");
            }
        })
    
    app.route("/user")
        .get(userController.renderProfilePage)
        
    app.route("/trades")
        .get(function(req, res) {
            if (req.isAuthenticated()) {
                res.render("trades");
            } else {
                res.redirect("/");
            }
        })
}

module.exports = routes;
