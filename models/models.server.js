module.exports = function () {

    var userModel = require("./user/user.model.server")();
    var adminModel = require("./admin/admin.model.server")();

    var connectionString = 'mongodb://127.0.0.1:27017/spartan';

    if(process.env.MLAB_USERNAME) {
        connectionString = process.env.MLAB_USERNAME + ":" +
            process.env.MLAB_PASSWORD + "@" +
            process.env.MLAB_HOST + ':' +
            process.env.MLAB_PORT + '/' +
            process.env.MLAB_APP_NAME;
    }

    var mongoose = require("mongoose");
    var Promise = require('bluebird');

    var options = { promiseLibrary: require('bluebird') };
    mongoose.createConnection(connectionString, options);

    var model = {
        UserModel: userModel,
        AdminModel: adminModel
    };
    return model;
};