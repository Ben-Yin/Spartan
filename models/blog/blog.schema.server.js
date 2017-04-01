module.exports = function () {
    var mongoose = require('mongoose');
    var PostSchema = mongoose.Schema({
        _poster : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        content: String,
        postType: {
            type: String,
            enum: ['Public', 'Private', 'Group']
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }],
        postDate: {type: Date, default: Date.now()}
    }, {collection: "post"});

    return PostSchema;
};