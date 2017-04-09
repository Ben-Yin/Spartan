module.exports = function () {
    var userModel = require("./user/user.model.server")();
    var adminModel = require("./admin/admin.model.server")();
    var blogModel = require("./blog/blog.model.server")();
    var commentModel = require("./comment/comment.model.server")();
    var postModel = require("./post/post.model.server")();

    var connectionString = 'mongodb://127.0.0.1:27017/spartan';

    if(process.env.MLAB_USERNAME) {
        connectionString = process.env.MLAB_USERNAME + ":" +
            process.env.MLAB_PASSWORD + "@" +
            process.env.MLAB_HOST + ':' +
            process.env.MLAB_PORT + '/' +
            process.env.MLAB_APP_NAME;
    }

    if(process.env.MONGODB_URI) {
        connectionString = process.env.MONGODB_URI;
    }

    var mongoose = require("mongoose");
    var Promise = require("bluebird");

    var options = { promiseLibrary: require('bluebird') };
    mongoose.connect(connectionString, options);

    var model = {
        UserModel: userModel,
        AdminModel: adminModel,
        BlogModel: blogModel,
        CommentModel: commentModel,
        PostModel: postModel,
        Promise: Promise
    };
    return model;
};