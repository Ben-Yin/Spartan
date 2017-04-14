/**
 * Created by BenYin on 4/8/17.
 */
var multer = require('multer'); // npm install multer --save
var upload = multer({ dest: __dirname+'/../public/uploads/postImage' });

module.exports = function (app, model) {
    app.post("/api/user/:userId/post", createPost);
    app.get("/api/post/:postId", findPostById);
    app.get("/api/user/:userId/post", findPostByUserId);
    app.get("/api/post/following/:userId", findFollowingPostByUserId);
    app.get("/api/post", findPostByConditions);
    app.put("/api/post/:postId", updatePost);
    app.delete("/api/post/:postId", deletePost);
    app.post("/api/post/:postId/comment", addCommentForPost);
    app.post("/api/upload/post", upload.single('uploadImage'), uploadImage);
    app.get("/api/find/posts",findAllPosts);
    app.get("/api/find/posts/by/:poster",findPostByPoster);
    function findPostByPoster(req,res) {
        var poster=req.params.poster;
        model.PostModel.findPostByPoster(poster)
            .then(function (posts) {
                res.json(posts)
            },function (err) {
                res.sendStatus(500);
                console.log(err)
            })
    }
    function findAllPosts(req,res) {
        model.PostModel.findAllPosts()
            .then(
                function (posts) {
                    res.json(posts);
                },function (err) {
                    res.sendStatus(500);
                    console.log(err);
                }
            )
    }

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
                    user.following.push(userId);
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
                function (posts) {
                    res.json(posts);
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
            .PostModel
            .findPostById(postId)
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
                    console.log(err);
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
                    res.sendStatus(500);
                }
            )
            .catch(
                function (err) {
                    res.sendStatus(500);
                }
            );
    }
    
    function uploadImage(req, res) {
        var userId = req.body.userId;
        var content = req.body.content;
        var posterName=req.body.posterName;
        var userType=req.body.usertype;
        if(req.file !=undefined) {
            var post = {
                "_poster": userId,
                "content": content,
                "imageUrl": "/uploads/postImage/" + req.file.filename,
                "likes": [],
                "comments": [],
                "posterName":posterName
            };
            model
                .PostModel
                .createPost(post)
                .then(
                    function (post) {
                        if(userType=='Admin'){
                            res.redirect("/#/admin");
                        }else{
                            res.redirect("/#/post");
                        }

                    }, function (err) {
                        console.log(err);
                        res.sendStatus(500);
                    }
                );
        } else{
            if(userType=='Admin'){
                res.redirect("/#/admin");
            }else{
                res.redirect("/#/post");
            }
        }
    }
};