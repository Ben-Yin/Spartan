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
            if ($location.url().startsWith("/post/my")) {
                vm.posterId = $routeParams.userId;
                UserService
                    .getUserById(vm.posterId)
                    .success(
                        function (user) {
                            vm.poster = user;
                            vm.pageType = {
                                heading: user.username+"'s Post"
                            };
                            setFollow(user._id);
                            setFollowerNum(user._id);
                            PostService
                                .findPostByUserId(user._id)
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
                comment.commenterName = vm.user.username;
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
            if (!vm.user) {
                $location.url("/register");
            }
            var posterIndex = vm.user.following.indexOf(userId);
            if (posterIndex != -1) {
                vm.user.following.splice(posterIndex, 1);
                vm.poster.followerNum -= 1;

            } else {
                vm.user.following.push(userId);
                vm.poster.followerNum += 1;
            }
            UserService
                .updateUser(vm.user._id, vm.user)
                .success(
                    function () {
                        setFollow(userId);
                    }
                );
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

        function searchPosts(keyword) {
            setPostsByConditions(keyword, vm.defaultSorting);
        }

        function setCommentView(post) {
            CommentService
                .findCommentByBlogId(post._id)
                .success(function (comments) {
                    post.commentsView = comments;
                });
        }

        function setPostsByConditions(key, sorting) {
            PostService
                .findPostByConditions(key, sorting)
                .success(
                    function (posts) {
                        vm.posts = posts;
                        for (var i in vm.posts) {
                            setHeartIcon(vm.posts[i]);
                            setCommentView(vm.posts[i]);
                        }

                    }
                );
        }

        function setHeartIcon(post) {
            if (vm.user && post.likes.indexOf(vm.user._id) != -1) {
                post.heartIcon = "icon-heart icon-large";
            } else {
                post.heartIcon = "icon-heart-empty icon-large";
            }
        }

        function setFollow(userId) {
            if (vm.user && userId != vm.user._id) {
                vm.pageType.showFollow = true;
                if (vm.user.following.indexOf(userId) != -1) {
                    vm.pageType.followBtn = "btn btn-info active pull-right";
                    vm.pageType.followText = "Following";
                } else {
                    vm.pageType.followBtn = "btn btn-info pull-right";
                    vm.pageType.followText = "Follow";
                }
            }
        }

        function setFollowerNum(userId) {
            UserService
                .countFollowerById(userId)
                .success(
                    function (res) {
                        vm.poster.followerNum = res.followerNum;
                    }
                );
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