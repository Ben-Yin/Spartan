module.exports = function () {
    var mongoose = require('mongoose');
    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other']
        },
        age: Number,
        weight: Number,
        height: Number
    }, {collection: "user"});

    return UserSchema;
};