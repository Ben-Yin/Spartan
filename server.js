var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var favicons = require('connect-favicons')
var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var bcrypt = require("bcrypt-nodejs");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure a public directory to host static content
app.use(favicons(__dirname + '/public/images/icons'));
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(session({
    secret: "hahah",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


require ("./app.js")(app);

console.log("Server start!");

var port = process.env.PORT || 3000;

app.listen(port);

