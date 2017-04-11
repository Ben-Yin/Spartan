/**
 * Created by BenYin on 4/9/17.
 */
(function () {
    angular
        .module("Spartan")
        .controller("PostListController", postListController);

    function postListController($sce, $route, $location, $routeParams, $rootScope, PostService, UserService, CommentService) {
        var vm = this;
        vm.likePost = likePost;
        vm.showCommentInput = showCommentInput;
        vm.postComment = postComment;
        vm.followPoster = followPoster;
        vm.deletePost = deletePost;
        vm.searchPosts = searchPosts;
        vm.setPostsByConditions = setPostsByConditions;
        vm.getTrustUrl = getTrustUrl;
        vm.getFormattedDate = getFormattedDate;
        vm.logout = logout;
        function init() {
            vm.user = $rootScope.currentUser;
            vm.defaultSorting = "trending";
            if ($location.url().startsWith("/post/my") && vm.user) {
                vm.posterId = $routeParams.userId;
                UserService
                    .getUserById(vm.posterId)
                    .success(
                        function (user) {
                            vm.pageType = {
                                heading: user.username+"'s Post"
                            };
                            if (user._id != vm.user._id) {
                                vm.pageType.showFollow = true;
                            }
                            if (vm.user.following.indexOf(user._id) != -1) {
                                vm.pageType.followBtn = "btn btn-info active pull-right";
                                vm.pageType.followText = "Following";
                            } else {
                                vm.pageType.followBtn = "btn btn-info pull-right";
                                vm.pageType.followText = "Follow";
                            }
                            PostService
                                .findPostByUserId(vm.user._id)
                                .success(
                                    function (posts) {
                                        vm.posts = posts;
                                        for (var i in vm.posts) {
                                            vm.posts[i].posterName = user.username;
                                            setHeartIcon(vm.posts[i]);
                                            setCommentView(vm.posts[i]);
                                        }
                                    }
                                );
                        }
                    )

            } else if ($location.url() == "/post/trend") {
                setPostsByConditions(null, vm.defaultSorting);
                vm.pageType = {
                    heading: "Trending Post"
                };
            } else if (vm.user){
                PostService
                    .findFollowingPostByUserId(vm.user._id)
                    .success(
                        function (posts) {
                            vm.posts = posts;
                            for (var i in vm.posts) {
                                setPosterForPost(vm.posts[i]);
                                setHeartIcon(vm.posts[i]);
                                setCommentView(vm.posts[i]);
                            }
                        }
                    );
                vm.pageType = {
                    heading: "My Following Post"
                };
            } else {
                setPostsByConditions(null, vm.defaultSorting);
            }
        }

        init();

        function likePost(userId, post) {
            console.log(post);
            var userIndex = post.likes.indexOf(userId);
            if (userIndex != -1) {
                post.likes.splice(userIndex, 1);
                PostService
                    .updatePost(post._id, post)
                    .success(
                        function (status) {
                            post.heartIcon = "icon-heart-empty icon-large";
                        }
                    );


            } else {
                post.likes.push(userId);
                PostService
                    .updatePost(post._id, post)
                    .success(
                        function (status) {
                            post.heartIcon = "icon-heart icon-large";
                        }
                    );
            }
        }

        function showCommentInput(post) {
            post.commentInput = !post.commentInput;
        }

        function postComment(post) {
            var comment = {
                "_post": post._id,
                "content": post.newComment
            };
            if (vm.user) {
                comment._user = vm.user._id;
            } else {
                comment._user = null;
            }
            PostService
                .addCommentForPost(post._id, comment)
                .success(
                    function (status) {
                        post.newComment = null;
                        post.commentInput = false;
                        setCommentView(post);
                    }
                );
        }

        function followPoster(userId) {
            var posterIndex = vm.user.following.indexOf(userId);
            console.log(vm.user.following);
            if (posterIndex != -1) {
                vm.user.following.splice(posterIndex, 1);
                UserService
                    .updateUser(vm.user._id, vm.user)
                    .success(
                        function () {
                            vm.pageType.followBtn = "btn btn-info pull-right";
                            vm.pageType.followText = "Follow";
                        }
                    )
            } else {
                vm.user.following.push(userId);
                UserService
                    .updateUser(vm.user._id, vm.user)
                    .success(
                        function () {
                            vm.pageType.followBtn = "btn btn-info active pull-right";
                            vm.pageType.followText = "Following";
                        }
                    );
            }
        }

        function deletePost(postId) {
            PostService
                .deletePost(postId)
                .success(
                    function () {
                        $route.reload();
                    }
                )
        }
        function setPosterForPost(post) {
            UserService
                .getUserById(post._poster)
                .success(
                    function (user) {
                        post.posterName = user.username;
                    }
                );
        }

        function searchPosts(keyword) {
            setPostsByConditions(keyword, vm.defaultSorting);
        }

        function setCommentView(post) {
            CommentService
                .findCommentByBlogId(post._id)
                .success(function (comments) {
                    post.commentsView = comments;
                    for (var i in post.commentsView) {
                        setCommenter(post.commentsView[i]);
                    }
                });
        }

        function setPostsByConditions(key, sorting) {
            PostService
                .findPostByConditions(key, sorting)
                .success(
                    function (posts) {
                        vm.posts = posts;
                        for (var i in vm.posts) {
                            setPosterForPost(vm.posts[i]);
                            setHeartIcon(vm.posts[i]);
                            setCommentView(vm.posts[i]);
                        }

                    }
                );
        }

        function setCommenter(comment) {
            UserService
                .getUserById(comment._user)
                .success(
                    function (user) {
                        comment.commenter = user.username;
                    }
                )
                .error(
                    function () {
                        comment.commenter = "Visitor";
                    }
                )
        }

        function setHeartIcon(post) {
            if (vm.user && post.likes.indexOf(vm.user._id) != -1) {
                post.heartIcon = "icon-heart icon-large";
            } else {
                post.heartIcon = "icon-heart-empty icon-large";
            }
        }

        function getTrustUrl(WidgetUrl) {
            return $sce.trustAsResourceUrl(WidgetUrl);
        }

        function getFormattedDate(dateStr) {
            var date = new Date(dateStr);
            return date.toDateString();
        }

        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    });
        }

    }
})();