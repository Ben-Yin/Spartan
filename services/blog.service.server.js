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
    app.post("/api/user/:userId/blog/:blogId/comment", addCommentForBlog);

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
                    res.sendStatus(500).send(err);
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
        var blogNum = parseInt(req.query.blogNum);
        var category = req.query.category;
        var sorting = req.query.sorting;
        model
            .BlogModel
            .findBlogByConditions(blogNum, category, sorting)
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
                    res.sendStatus(500).send(err);
                }
            );

    }

    function addCommentForBlog(req, res) {
        var blogId = req.params.blogId;
        var userId = req.params.userId;
        var comment = req.body;
        comment._user = userId;
        comment._post = blogId;
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
            );
    }

};