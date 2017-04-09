/**
 * Created by Chaos on 4/8/2017.
 */
module.exports = function (app) {
    var models = require("./models/models.server")();
    require("./services/user.service.server")(app, models);
    require("./services/blog.service.server")(app, models);
    require("./services/comment.service.server")(app, models);
    require("./services/post.service.server")(app, models);
}