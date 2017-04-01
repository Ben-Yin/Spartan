var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

<<<<<<< Updated upstream
||||||| merged common ancestors
require("./test/app.js")(app);
require("./assignment/app.js")(app);

=======

var models = require("./model/models.server")();
require("./services/user.service.server")(app, models);
require("./services/website.service.server")(app, models);
require("./services/page.service.server")(app, models);
require("./services/widget.service.server")(app, models);
require("./services/flickr.service.server")(app, models);


>>>>>>> Stashed changes
var port = process.env.PORT || 3000;

app.listen(port);

