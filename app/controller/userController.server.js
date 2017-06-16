'use strict';
var User = require(process.cwd() + "/app/model/users.js");

var notAuthenticated = {
    status: "Error",
    message: "Not Authenticated"
}

var noResults = {
    status: "Error", 
    message: "No results found."
}

module.exports = {
    createUser: function createUser (req, res) {
        User.findOne({username: req.body.username})
                .select('username password')
                .exec(function(err, results) {
                    console.log(results)
                   if (!results) {
                       var newUser = new User({
                           username: req.body.username,
                           password: req.body.password
                       })
                       
                       newUser.save(function(err, results) {
                           if (err) throw err;
                           
                           if (results) {
                                console.log("createUser: function createUser was successful");
                                res.redirect("/");
                                //res.json({status: "Success", message: "User Saved!", results})    
                           }
                       })
                   } else {
                       console.log("createUser: function createUser error user already exists");
                       res.json({status: "Error", message: "User already exists"});
                   }
                });
    },
    
    updateUser: function updateUser(req, res) {
        console.log("update user");
        User.findOne({username: req.user.username}, function(err, user) {
            if (err) throw err;
            
            if (!user) {
                res.json({status: "Error", message: "User not found"});
            } else {

                if (req.body.password) {
                    user.password = req.body.password;    
                }
                if (req.body.firstName) {
                    user.name.firstName = req.body.firstName;   
                }
                
                if (req.body.lastName) {
                    user.name.lastName = req.body.lastName;
                }
                
                if (req.body.firstName || req.body.lastName) {
                    user.name.fullName = req.body.firstName + " " + req.body.lastName;
                }
                
                if (req.body.city) {
                    user.city = req.body.city;
                }
                
                if (req.body.state) {
                    user.state = req.body.state;
                }
                user.save(function(err, results) {
                    if (err) throw err;
                    
                    if (results) {
                        res.json({status: "Success", message: "User Saved"});
                    }
                })
            }
        })
    },
    
    getUserDetails: function getUserDetails(req, res) {
        var username = req.params.id;
        User.findOne({username: username}, {_id: false, __v: false}, function(err, user) {
            if (!user) {
                res.json({status: "Error", message: "User not found"});
            } else {
                res.json(user);
            }
        })
    },
    
    renderProfilePage: function renderProfilePage(req, res) {
        if (req.isAuthenticated()) {
            User.findOne({username: req.user.username}, function(err, user) {
                if (err) throw err;
                    
                    res.render("user", {
                        firstName: user.name.firstName,
                        lastName: user.name.lastName,
                        city: user.city,
                        state: user.state
                    })
                })                
        } else {
            res.redirect("/");
        }  
    }
}