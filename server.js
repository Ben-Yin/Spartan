var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var cookieParser=require('cookie-parser');
var session=require('express-session');
var passport=require('passport');

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

var models = require("./models/models.server")();
require("./services/user.service.server")(app, models);
require("./services/blog.service.server")(app, models);
require("./services/comment.service.server")(app, models);

var port = process.env.PORT || 3000;

app.listen(port);

