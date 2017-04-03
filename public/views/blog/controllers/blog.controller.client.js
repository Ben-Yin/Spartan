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
        vm.getFormatedDate = getFormatedDate;
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

        function getFormatedDate(dateStr) {
            var date = new Date(dateStr);
            // return String(date.getMonth()+1)+" "+
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