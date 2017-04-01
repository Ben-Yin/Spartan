/**
 * Created by BenYin on 3/30/17.
 */
module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.Promise = require('bluebird');
    var CommentSchema = require('./comment.schema.server')();
    var CommentModel = mongoose.model("CommentModel", CommentSchema);

    var api = {
        createComment : createComment,
        findCommentByPostId: findCommentByPostId,
        findCommentById: findCommentById,
        updateComment: updateComment,
        deleteComment: deleteComment,
        deleteComments: deleteComments
    };
    return api;

    function createComment(comment) {
        return CommentModel.create(comment);
    }

    function findCommentByPostId(postId) {
        return CommentModel.find({_post:postId});
    }

    function findCommentById(commentId) {
        return CommentModel.findById(commentId);
    }

    function updateComment(commentId, comment) {
        return CommentModel.update({_id: commentId}, {$set: comment});
    }

    function deleteComment(commentId) {
        return CommentModel.remove({_id: commentId});
    }
    
    function deleteComments(commentIds) {
        return CommentModel.remove({_id: {$in: commentIds}});
    }

};