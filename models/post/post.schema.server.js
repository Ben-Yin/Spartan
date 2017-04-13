/**
 * Created by BenYin on 4/8/17.
 */
module.exports = function () {
    var mongoose = require('mongoose');
    return mongoose.Schema({
        _poster : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        content: String,
        imageUrl: String,
        posterName:String,
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
};