module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.Promise = require('bluebird');
    var BlogSchema = require('./blog.schema.server')();
    var BlogModel = mongoose.model("BlogModel", BlogSchema);

    var api = {
        createBlog : createBlog,
        findBlogById: findBlogById,
        findBlogByUserId: findBlogByUserId,
        findBlogByConditions: findBlogByConditions,
        updateBlog: updateBlog,
        deleteBlog: deleteBlog,
        addCommentForBlog: addCommentForBlog,
        findAllBlogs:findAllBlogs,
        countBlogByUserId: countBlogByUserId,
        findBlogsByBlogger:findBlogsByBlogger

    };
    return api;

    function findBlogsByBlogger(blogger) {
        return BlogModel.find({bloggerName:blogger});
    }
    function findAllBlogs() {
        return BlogModel.find();
    }
    function createBlog(blog) {
        return BlogModel.create(blog);
    }

    function findBlogById(blogId) {
        return BlogModel.findById(blogId);
    }

    function findBlogByUserId(userId) {
        return BlogModel
            .find({"_blogger": userId})
            .sort({"postDate": -1});
    }

    function findBlogByConditions(key, category, sorting) {
        var condition = {};
        if (key) {
            condition.title = new RegExp(key);
        }
        if (category) {
            condition.category = category;
        }
        var query = BlogModel.find(condition);
        if (sorting == "trending") {
            query = query.sort({"likes": -1});
        } else if (sorting == "Date") {
            query = query.sort({"postDate": -1});
        }
        return query;

    }

    function updateBlog(blogId, blog) {
        return BlogModel.update({_id: blogId}, {$set: blog});
    }

    function deleteBlog(blogId) {
        return BlogModel.remove({_id: blogId});
    }

    function addCommentForBlog(blogId, comment) {
        return BlogModel
            .findById(blogId, function (err, blog) {
                if (err) return handleError(err);
                blog.comments.push(comment);
                blog.save();
            });
    }

    function countBlogByUserId(userId) {
        return BlogModel.count({_blogger: userId});
    }
};