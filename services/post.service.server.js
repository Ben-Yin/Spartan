/**
 * Created by BenYin on 4/8/17.
 */
module.exports = function (app, model) {
    app.post("/api/user/:userId/post", createPost);
    app.get("/api/post/:postId", findPostById);
    app.get("/api/user/:userId/post", findPostByUserId);
    app.get("/api/post/following/:userId", findFollowingPostByUserId);
    app.get("/api/post", findPostByConditions);
    app.put("/api/post/:postId", updatePost);
    app.delete("/api/post/:postId", deletePost);
    app.post("/api/post/:postId/comment", addCommentForPost);

    function createPost(req, res) {
        var userId = req.params.userId;
        var post = req.body;
        post._poster = userId;
        model
            .PostModel
            .createPost(post)
            .then(
                function (newPost) {
                    res.json(newPost);
                }, function () {
                    res.sendStatus(500);
                }
            );
    }

    function findPostById(req, res) {
        var postId = req.params.postId;
        model
            .PostModel
            .findPostById(postId)
            .then(
                function (post) {
                    res.json(post);
                }, function () {
                    res.sendStatus(500);
                }
            );
    }

    function findPostByUserId(req, res) {
        var userId = req.params.userId;
        model
            .PostModel
            .findPostByUserId(userId)
            .then(
                function (post) {
                    res.json(post);
                }, function () {
                    res.sendStatus(500);
                }
            );
    }

    function findFollowingPostByUserId(req, res) {
        var userId = req.params.userId;
        model
            .UserModel
            .findUserById(userId)
            .then(
                function (user) {
                    return model
                        .PostModel
                        .findPostByUserIds(user.following);
                }
            )
            .then(
                function (posts) {
                    res.json(posts);
                }, function () {
                    res.sendStatus(500);
                }
            )
            .catch(
                function () {
                    res.sendStatus(500);
                }
            );
    }

    function findPostByConditions(req, res) {
        var key = req.query.key;
        var sorting = req.query.sorting;
        model
            .PostModel
            .findPostByConditions(key, sorting)
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

    function updatePost(req, res) {
        var postId= req.params.postId;
        var post = req.body;
        model
            .PostModel
            .updatePost(postId, post)
            .then(
                function (status) {
                    res.sendStatus(200);
                }, function () {
                    res.sendStatus(500);
                }
            );
    }

    function deletePost(req, res) {
        var postId = req.params.postId;
        model
            .BlogModel
            .findBlogById(postId)
            .then(
                function (post) {
                    return model
                        .Promise
                        .join(
                            model
                                .CommentModel
                                .deleteComments(post.comments),
                            post.remove(),
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

    function addCommentForPost(req, res) {
        console.log("get add comment request");
        var postId = req.params.postId;
        var comment = req.body;
        model
            .CommentModel
            .createComment(comment)
            .then(
                function (newComment) {
                    return model
                        .PostModel
                        .addCommentForPost(postId, newComment);
                }
            )
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    console.log("have trouble");
                    res.sendStatus(500);
                }
            )
            .catch(
                function (err) {
                    console.log("have trouble");
                    res.sendStatus(500);
                }
            );
    }
};