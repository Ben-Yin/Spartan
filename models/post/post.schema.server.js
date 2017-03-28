module.exports = function () {
    var mongoose = require('mongoose');
    var PostSchema = mongoose.Schema({
        _poster : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
        content: String,
        postType: {
            type: String,
            enum: ['Public', 'Private', 'Group']
        },
        like: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }],
        comment: [{
            _user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            content: String,
            commentDate: {type: Date, default: Date.now()}
        }],
        postDate: {type: Date, default: Date.now()}
    }, {collection: "post"});

    return PostSchema;
};