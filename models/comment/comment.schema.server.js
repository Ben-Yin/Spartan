/**
 * Created by BenYin on 3/30/17.
 */
module.exports = function () {
    var mongoose = require('mongoose');
    return mongoose.Schema({
        _user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        commenterName: String,
        _post: {
            type: mongoose.Schema.Types.ObjectId
        },
        content: String,
        commentDate: {type: Date, default: Date.now()}
    }, {collection: "comment"});

};