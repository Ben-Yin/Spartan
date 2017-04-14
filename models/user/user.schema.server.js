module.exports = function () {
    var mongoose = require('mongoose');
    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstname: String,
        lastname: String,
        email: String,
        phone: String,
        sex: {
            type: String,
            enum: ['Male', 'Female', 'Other']
        },
        age: Number,
        weight: {
            value: Number,
            unit: {
                type: String,
                enum: ['kg', 'lb']
            }
        },
        height: {
            value: Number,
            unit: {
                type: String,
                enum: ['cm', 'in']
            }
        },
        avatar:String,
        usertype:{
            type: String,
            enum: ["Membership", "Coach", "Admin"]
        },
        selfIntro:String,
        loggedin:{type:Boolean,default:false},
        service:Boolean,
        news:Boolean,
        facebook: {
            id:    String,
            token: String
        },
        google: {
            id:    String,
            token: String
        },
        github: {
            id:    String,
            token: String
        },
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }],
        storecourse:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'training'
            }
        ]
    }, {collection: "user"});

    return UserSchema;
};