module.exports = function () {
    var mongoose = require('mongoose');
    var AdminSchema = mongoose.Schema({
        adminName: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone:String,
        dateCreates: {type: Date, default: Date.now()}
    }, {collection: "admin"});

    return AdminSchema;
};