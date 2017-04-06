module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.Promise = require('bluebird');
    var UserSchema = require('./user.schema.server')();
    var UserModel = mongoose.model("UserModel", UserSchema);

    var api = {
        findUserByGoogleId:findUserByGoogleId,
        findUserByFacebookId: findUserByFacebookId,
        createUser : createUser,
        findUserById: findUserById,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserByCredential:findUserByCredential,
        findUserByUsername: findUserByUsername
    };
    return api;

    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }

    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }
    function findUserByGoogleId(googleId) {
        return UserModel.findOne({'googleId.id': googleId});
    }

    function createUser(user) {
        // console.log("model create user",user);
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function updateUser(userId, user) {
        return UserModel
            .update(
                {
                    _id: userId
                },
                {$set: user}
            );
    }

    function deleteUser(userId) {
        return UserModel
            .remove({_id: userId});
    }

    function findUserByCredential(username, password){
        return UserModel
            .findOne(
                {
                    username : username,
                    password : password
                }
            );
    }

    function findUserByUsername(username) {
        return UserModel
            .findOne({username: username});
    }
};