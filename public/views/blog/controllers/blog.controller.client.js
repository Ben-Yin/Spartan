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

    function BlogListController($routeParams, BlogService) {
        var vm = this;
        vm.userId = $routeParams.userId;

        function init() {
            if (vm.userId) {
                BlogService
                    .findBlogByUserId(vm.userId)
                    .success(
                        function (blogs) {
                            vm.blogs = blogs;
                        }
                    );
            } else {
                var trendBlogsNum = 20;
                BlogService
                    .findBlogByConditions(trendBlogsNum, null, "trending")
                    .success(
                        function (blogs) {
                            vm.blogs = blogs;
                        }
                    );
            }
        }
        init();
    }

    function SingleBlogController($routeParams, BlogService, CommentService) {
        var vm = this;
        vm.blogId = $routeParams.blogId;

        function init() {
            BlogService
                .findBlogById(vm.blogId)
                .success(function (blog) {
                    vm.blog = blog;
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
    }

    function EditBlogController($routeParams, BlogService) {
        var vm = this;
        vm.blogId = $routeParams.blogId;

        function init() {
            BlogService
                .findBlogById(vm.blogId)
                .success(function (blog) {
                    vm.blog = blog;
                });
        }
        init();

        function updateBlog(blog) {
            BlogService
                .updateBlog(vm.blogId, blog)
                .success(function (status) {
                    console.log("update blog success");
                });
        }

        function deleteBlog(blogId) {
            BlogService
                .deleteBlog(blogId)
                .success(function (status) {
                    console.log("delete blog success");
                });
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