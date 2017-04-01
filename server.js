var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

var models = require("./models/models.server")();
require("./services/user.service.server")(app, models);
require("./services/blog.service.server")(app, models);
require("./services/comment.service.server")(app, models);

var port = process.env.PORT || 3000;

app.listen(port);

