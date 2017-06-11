'use strict';

const LocalStrategy = require('passport-local');
var User = require(process.cwd() + "/app/model/users.js");

module.exports = function(passport) {
    passport.use(new LocalStrategy(
      function(username, password, done) {
          User.findOne({username: username}).exec(function(err, user) {
             if (err) {
                 return done(err);
             } 
             
             if (!user) {
                 return done(null, false);
             }
             
             if (user.password !== password) {
                 return done(null, false);
             }
             console.log("auth successful")
             return done(null, user);
          });
      }    
    ));
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id).exec(function(err, user) {
            if (err) {
                return done(err);
            }
            
            done(null, user);
        })
    })
}