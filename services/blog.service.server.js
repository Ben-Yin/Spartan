/**
 * Created by BenYin on 3/30/17.
 */
module.exports = function (app, model) {
    app.post("/api/user/:userId/blog", createBlog);
    app.get("/api/blog/:blogId", findBlogById);
    app.get("/api/user/:userId/blog", findBlogByUserId);
    app.get("/api/blog", findBlogByConditions);
    app.put("/api/blog/:blogId", updateBlog);
    app.delete("/api/blog/:blogId", deleteBlog);
    app.post("/api/blog/:blogId/comment", addCommentForBlog);
    app.get("/api/find/blogs",findAllBlogs);

    function findAllBlogs(req,res) {
        model.BlogModel.findAllBlogs()
            .then(
                function (blogs) {
                    res.json(blogs);
                },function (err) {
                    res.sendStatus(500);
                    console.log(err);
                }
            );

    }

    function createBlog(req, res) {
        var userId = req.params.userId;
        var blog = req.body;
        blog._blogger = userId;
        model
            .BlogModel
            .createBlog(blog)
            .then(
                function (newBlog) {
                    res.json(newBlog);
                },
                function (err) {
                    res.sendStatus(500);
                }
            )
    }
    
    function findBlogById(req, res) {
        var blogId = req.params.blogId;
        model
            .BlogModel
            .findBlogById(blogId)
            .then(
                function (blog) {
                    res.json(blog);
                },
                function (err) {
                    res.sendStatus(500);
                }
            );
    }
    
    function findBlogByUserId(req, res) {
        var userId = req.params.userId;
        model
            .BlogModel
            .findBlogByUserId(userId)
            .then(
                function (blog) {
                    res.json(blog);
                },
                function (err) {
                    res.sendStatus(500);
                }
            );
    }


    function findBlogByConditions(req, res) {
        var key = req.query.key;
        var category = req.query.category;
        var sorting = req.query.sorting;
        model
            .BlogModel
            .findBlogByConditions(key, category, sorting)
            .then(
                function (blogs) {
                    res.json(blogs);
                },
                function (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
            );
    }

    function updateBlog(req, res) {
        var blogId = req.params.blogId;
        var blog = req.body;
        model
            .BlogModel
            .updateBlog(blogId, blog)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.sendStatus(500);
                }
            );
    }

    function deleteBlog(req, res) {
        var blogId = req.params.blogId;
        model
            .BlogModel
            .findBlogById(blogId)
            .then(
                function (blog) {
                    return model
                        .Promise
                        .join(
                            model
                                .CommentModel
                                .deleteComments(blog.comments),
                            blog.remove(),
                            function () {
                            }
                        );
                }
            )
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.sendStatus(500);
                }
            )
            .catch(
                function (err) {
                    res.sendStatus(500);
                }
            );

    }

    function addCommentForBlog(req, res) {
        var blogId = req.params.blogId;
        var comment = req.body;
        model
            .CommentModel
            .createComment(comment)
            .then(
                function (newComment) {
                    return model
                        .BlogModel
                        .addCommentForBlog(blogId, newComment);
                }
            )
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.sendStatus(500);
                }
            )
            .catch(
                function (err) {
                    res.sendStatus(500);
                }
            );
    }

};