/**
 * Created by BenYin on 4/8/17.
 */
module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.Promise = require('bluebird');
    var PostSchema = require('./post.schema.server')();
    var PostModel = mongoose.model("PostModel", PostSchema);

    var api = {
        createPost : createPost,
        findPostById: findPostById,
        findPostByUserId: findPostByUserId,
        findPostByUserIds: findPostByUserIds,
        updatePost: updatePost,
        deletePost: deletePost,
        addCommentForPost: addCommentForPost
    };
    return api;

    function createPost(post) {
        return PostModel.create(post);
    }

    function findPostById(postId) {
        return PostModel.findById(postId);
    }

    function findPostByUserId(userId) {
        return PostModel
            .find({_poster: userId})
            .sort({postDate: -1});
    }

    function findPostByUserIds(userIds) {
        return PostModel
            .find({_poster: {$in: userIds}})
            .sort({postDate: -1});
    }

    function updatePost(postId, post) {
        return PostModel.update({_id: postId}, {$set: post});
    }

    function deletePost(postId) {
        return PostModel.remove({_id: postId});
    }

    function addCommentForPost(postId, comment) {
        return PostModel
            .findById(postId, function (err, post) {
                if (err) return handleError(err);
                post.comments.push(comment);
                post.save();
            });
    }
};