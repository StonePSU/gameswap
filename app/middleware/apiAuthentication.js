'use strict';

module.exports.api = function(req, res, next) {
    if (!req.isAuthenticated() && req.originalUrl !== '/api/user') {
        console.log(req);
        res.status(401).send("Error: Not Authenticated");
    }
    next();
}