/**
 * Created by BenYin on 3/31/17.
 */
(function () {
    angular
        .module("Spartan")
        .controller("BlogListController", BlogListController);

    function BlogListController($routeParams, $location, $rootScope, BlogService, UserService) {
        var vm = this;
        vm.getBlogIntro = getBlogIntro;
        vm.getFormattedDate = getFormattedDate;
        vm.getSingleBlogUrl = getSingleBlogUrl;
        vm.sortByCategory = sortByCategory;
        vm.logout=logout;

        function init() {
            vm.user = $rootScope.currentUser;
            vm.defaultSorting = "trending";
            if ($location.url() == "/blog/my") {
                BlogService
                    .findBlogByUserId(vm.user._id)
                    .success(
                        function (blogs) {
                            vm.blogs = blogs;
                            for (var i in vm.blogs) {
                                vm.blogs[i].bloggerName = vm.user.username;
                            }
                        }
                    );
            } else {
                vm.showCategory = true;
                setBlogsByConditions(null, null, vm.defaultSorting);
            }
            vm.categories = ["TRAINING", "RUNNING", "DIET", "SPORT", "HEALTH"];
        }
        init();

        function getBlogIntro(content) {
            if (content.length > 200) {
                var intro = content.slice(0, content.lastIndexOf(" ", 200));
                intro += "...";
            } else {
                intro = content;
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
            setBlogsByconditions(null, category, vm.defaultSorting);
        }

        function setBlogsByConditions(key, category, sorting) {
            BlogService
                .findBlogByConditions(key, category, "trending")
                .success(
                    function (blogs) {
                        vm.blogs = blogs;
                        for (var i in vm.blogs) {
                            setBloggerForBlog(vm.blogs[i]);
                        }
                    }
                );
        }

        function setBloggerForBlog(blog) {
            UserService
                .getUserById(blog._blogger)
                .success(
                    function (user) {
                        blog.bloggerName = user.username;
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