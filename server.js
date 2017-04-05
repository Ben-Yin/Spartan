var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var favicons = require('connect-favicons')
// configure a public directory to host static content
app.use(favicons(__dirname + '/public/images/icons'));
app.use(express.static(__dirname + '/public'));
var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

app.use(session({
    secret: 'this is the secret',
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

var bcrypt = require("bcrypt-nodejs");

var models = require("./models/models.server")();
require("./services/user.service.server")(app, models);
require("./services/blog.service.server")(app, models);
require("./services/comment.service.server")(app, models);


var port = process.env.PORT || 3000;

app.listen(port);

