/**
 * Created by BenYin on 3/31/17.
 */
(function () {
    angular
        .module("Spartan")
        .controller("BlogListController", BlogListController)
        .controller("SingleBlogController", SingleBlogController)
        .controller("EditBlogController", EditBlogController)
        .controller("NewBlogController", NewBlogController);

    function BlogListController($routeParams, $location, BlogService) {
        var vm = this;
        vm.getBlogIntro = getBlogIntro;
        vm.getFormattedDate = getFormattedDate;
        vm.getSingleBlogUrl = getSingleBlogUrl;
        vm.sortByCategory = sortByCategory;
        vm.userId = $routeParams.userId;

        function init() {
            vm.trendBlogNum = 20;
            vm.defaultSorting = "trending";
            if (vm.userId) {
                BlogService
                    .findBlogByUserId(vm.userId)
                    .success(
                        function (blogs) {
                            vm.blogs = blogs;
                        }
                    );
            } else {
                setBlogsByconditions(vm.trendBlogNum, null, vm.defaultSorting);
            }
            vm.categories = ["TRAINING", "RUNNING", "DIET", "SPORT", "HEALTH"];
        }
        init();

        function getBlogIntro(content) {
            var intro = content.slice(0, content.lastIndexOf(" ", 200));
            if (content.length > 200) {
                intro += "...";
            }
            return intro;
        }

        function getFormattedDate(dateStr) {
            var date = new Date(dateStr);
            return date.toDateString();
        }

        function getSingleBlogUrl(blog) {
            $location.url("/blog/"+blog._id);
        }

        function sortByCategory(category) {
            setBlogsByconditions(vm.trendBlogNum, category, vm.defaultSorting);
        }

        function setBlogsByconditions(trendBlogNum, category, sorting) {
            BlogService
                .findBlogByConditions(trendBlogNum, category, "trending")
                .success(
                    function (blogs) {
                        vm.blogs = blogs;
                    }
                );
        }
    }

    function SingleBlogController($routeParams, BlogService, CommentService) {
        var vm = this;
        vm.postComment = postComment;
        vm.getFormattedDate = getFormattedDate;
        vm.likeBlog = likeBlog;
        vm.blogId = $routeParams.blogId;
        vm.userId = "58e2fe3a3e931c5dc3af6c41";

        function init() {
            BlogService
                .findBlogById(vm.blogId)
                .success(function (blog) {
                    vm.blog = blog;
                    if (vm.blog.likes.indexOf(vm.userId) == -1) {
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
            BlogService
                .addCommentForBlog(vm.blogId, comment)
                .success(function (status) {
                    console.log("add comment success");
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
    }

    function EditBlogController($routeParams, $location, BlogService) {
        var vm = this;
        vm.updateBlog = updateBlog;
        vm.blogId = $routeParams.blogId;

        function init() {
            BlogService
                .findBlogById(vm.blogId)
                .success(function (blog) {
                    vm.blog = blog;
                    vm.title = vm.blog.title;
                });
        }
        init();

        function updateBlog(blog) {
            BlogService
                .updateBlog(vm.blogId, blog)
                .success(function (status) {
                    $location.url("/blog/"+vm.blogId);
                });
        }

        function deleteBlog(blogId) {
            BlogService
                .deleteBlog(blogId)
                .success(function (status) {
                    $location.url("/blog");
                });
        }

        function findUserById(userId) {

        }
    }

    function NewBlogController($routeParams, BlogService) {
        var vm = this;
        vm.userId = $routeParams.userId;
        
        function init() {
            
        }
        init();
        
        function createBlog(blog) {
            BlogService
                .createBlog(vm.userId, blog)
                .success(function (status) {
                    console.log("create blog success");
                });
        }
    }


})();