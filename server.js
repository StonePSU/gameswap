const express = require('express')
    , mongoose = require('mongoose')
    , session = require('express-session')
    , passport = require('passport')
    , bodyParser = require('body-parser')
    , routes = require('./app/routes/routes.js')
    , middleware = require('./app/middleware/apiAuthentication.js');
require('dotenv').config();
require(process.cwd() + "/app/sec/passport.js")(passport);

var app = express();

/* DB */
mongoose.connect(process.env.MONGO_URI);

/* Configuration */
app.set('view engine', 'pug');

/* Middleware */
app.use(session({
    secret: 'gameSwap',
    resave: false,
    saveUninitialized: false
}));
app.use("/public", express.static(process.cwd() + "/public"));
app.use("/controller", express.static(process.cwd() + "/app/controller"));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: "application/json"}));
app.use("/api/*", middleware.api);

/* Routes */
routes(app, passport);

app.listen(8080 || process.env.PORT, function() {
   console.log("INFO: server has been initialized"); 
});