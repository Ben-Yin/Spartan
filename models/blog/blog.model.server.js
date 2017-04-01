module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.Promise = require('bluebird');
    var PostSchema = require('./post.schema.server')();
    var PostModel = mongoose.model("PostModel", PostSchema);

    var api = {
        createPost : createPost,
        findPostById: findPostById,
        updatePost: updatePost,
        deletePost: deletePost
    };
    return api;

    function createPost(post) {
        return PostModel.create(post);
    }

    function findPostById(postId) {
        return PostModel.findById(postId);
    }

    function updatePost(postId, post) {
        return PostModel
            .update({_id: postId}, {$set: post});
    }

    function deletePost(postId) {
        return PostModel
            .remove({_id: postId});
    }

};