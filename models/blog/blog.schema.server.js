module.exports = function () {
    var mongoose = require('mongoose');
    var BlogSchema = mongoose.Schema({
        _blogger : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        title: String,
        content: String,
        category: String,
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }],
        blogDate: {type: Date, default: Date.now()}
    }, {collection: "blog"});

    return BlogSchema;
};