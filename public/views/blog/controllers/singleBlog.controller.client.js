/**
 * Created by BenYin on 3/31/17.
 */
(function () {
    angular
        .module("Spartan")
        .controller("SingleBlogController", SingleBlogController);

    function SingleBlogController($routeParams, $location, $rootScope, BlogService, UserService, CommentService) {
        var vm = this;
        vm.postComment = postComment;
        vm.getFormattedDate = getFormattedDate;
        vm.redirectSingleBlog = redirectSingleBlog;
        vm.deleteBlog = deleteBlog;
        vm.logout=logout;
        vm.likeBlog = likeBlog;
        vm.blogId = $routeParams.blogId;
        function init() {
            vm.user = $rootScope.currentUser;
            BlogService
                .findBlogById(vm.blogId)
                .success(function (blog) {
                    vm.blog = blog;
                    UserService
                        .getUserById(blog._blogger)
                        .success(function (user) {
                            vm.blog.bloggerName = user.username;
                        });
                    if (!vm.user || vm.blog.likes.indexOf(vm.user._id) == -1) {
                        vm.thumbsUp = {
                            "like": false,
                            "icon": "icon-large icon-thumbs-up-alt"
                        };
                    } else {
                        vm.thumbsUp = {
                            "like": true,
                            "icon": "icon-large icon-thumbs-up"
                        }
                    }
                });

            CommentService
                .findCommentByBlogId(vm.blogId)
                .success(function (comments) {
                    vm.comments = comments;
                });
        }
        init();

        function postComment(comment) {
            comment._post = vm.blogId;
            if (vm.user) {
                comment._user = vm.user._id;
                comment.commenterName = vm.user.username;
            } else {
                comment._user = null;
                comment.commenterName = "Visitor";
            }
            BlogService
                .addCommentForBlog(vm.blogId, comment)
                .success(function (newComment) {
                    CommentService
                        .findCommentByBlogId(vm.blogId)
                        .success(function (comments) {
                            vm.comments = comments;
                        });
                    vm.comment = null;
                });
        }

        function likeBlog(userId, blog) {
            if (vm.thumbsUp.like) {
                var i = blog.likes.indexOf(userId);
                blog.likes.splice(i, 1);
                vm.thumbsUp = {
                    "like": false,
                    "icon": "icon-large icon-thumbs-up-alt"
                }
            } else {
                blog.likes.push(userId);
                vm.thumbsUp = {
                    "like": true,
                    "icon": "icon-large icon-thumbs-up"
                }
            }
            BlogService
                .updateBlog(blog._id, blog)
                .success(function (status) {
                    console.log("like blog success");
                });
        }

        function getFormattedDate(dateStr) {
            var date = new Date(dateStr);
            return date.toDateString();
        }

        function redirectSingleBlog(blog) {
            if (blog._id) {
                $location.url("/blog/"+blog._id);
            } else {
                $location.url("/blog");
            }
        }

        function deleteBlog(blogId) {
            BlogService
                .deleteBlog(blogId)
                .success(
                    function () {
                        $location.url("/blog/my/"+vm.user._id);
                    }
                )
        }

        function logout() {
            UserService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    });
        }
    }


})();