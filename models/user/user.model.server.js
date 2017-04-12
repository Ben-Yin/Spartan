module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.Promise = require('bluebird');
    var UserSchema = require('./user.schema.server')();
    var UserModel = mongoose.model("UserModel", UserSchema);

    var api = {
        findUserByGoogleId:findUserByGoogleId,
        findUserByFacebookId: findUserByFacebookId,
        findUserByGitHubId: findUserByGitHubId,
        createUser : createUser,
        findUserById: findUserById,
        findUsersByIds: findUsersByIds,
        findFollowerById: findFollowerById,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserByCredential:findUserByCredential,
        findUserByUsername: findUserByUsername,
        updateAvatar:updateAvatar,
        updatePassword:updatePassword
    };
    return api;

    function updatePassword(userId,password) {
        return UserModel
            .update(
                {_id: userId},
                {password: password}
            );
    }
    function findUserByGitHubId(githubId) {
        return UserModel.findOne({'github.id': githubId});
    }


    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }
    function findUserByGoogleId(googleId) {
        return UserModel.findOne({'google.id': googleId});
    }

    function createUser(user) {
        user.avatar="https://image.freepik.com/free-vector/variety-of-user-avatars_23-2147542131.jpg";
        user.loggedin=true;
        // console.log("model create user",user);
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function findUsersByIds(userIds) {
        return UserModel.find({_id:{$in:userIds}});
    }

    function findFollowerById(userId) {
        return UserModel.find({following:userId});
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

    function updateAvatar(userId, path) {
        return UserModel
            .update(
                {_id: userId},
                {avatar: path}
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