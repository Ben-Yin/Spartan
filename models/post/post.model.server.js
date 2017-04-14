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
        findPostByConditions: findPostByConditions,
        updatePost: updatePost,
        deletePost: deletePost,
        addCommentForPost: addCommentForPost,
        findAllPosts:findAllPosts,
        countPostByUserId: countPostByUserId,
        findPostByPoster:findPostByPoster
    };
    return api;

    function findPostByPoster(poster) {
        return PostModel.find({posterName:poster});
    }
    function findAllPosts() {
        return PostModel.find();
    }
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

    function findPostByConditions(key, sorting) {
        var condition = {};
        if (key) {
            condition.content = new RegExp(key);
        }
        var query = PostModel.find(condition);
        if (sorting == "trending") {
            query = query.sort({"likes": -1});
        } else if (sorting == "Date") {
            query = query.sort({"postDate": -1});
        }
        return query;
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

    function countPostByUserId(userId) {
        return PostModel.count({_poster: userId});
    }
};