module.exports = function () {
    var mongoose = require('mongoose');
    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstname: String,
        lastname: String,
        email: String,
        phone: String,
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other']
        },
        age: Number,
        weight: Number,
        height: Number,
        avatar:String,
        usertype:String,
        selfIntro:String,
        loggedin:{type:Boolean,default:false},
        service:Boolean,
        news:Boolean
    }, {collection: "user"});

    return UserSchema;
};