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

    function BlogListController($routeParams, $location, $rootScope, BlogService, UserService) {
        var vm = this;
        vm.getBlogIntro = getBlogIntro;
        vm.getFormattedDate = getFormattedDate;
        vm.getSingleBlogUrl = getSingleBlogUrl;
        vm.sortByCategory = sortByCategory;
        vm.logout=logout;

        function init() {
            vm.user = $rootScope.currentUser;
            vm.trendBlogNum = 20;
            vm.defaultSorting = "trending";
            if ($location.url() == "/blog/my") {
                BlogService
                    .findBlogByUserId(vm.user._id)
                    .success(
                        function (blogs) {
                            vm.blogs = blogs;
                            setBloggerforBlogs(vm.blogs);
                        }
                    );
            } else {
                vm.showCategory = true;
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
                        setBloggerforBlogs(vm.blogs);
                    }
                );
        }

        function setBloggerforBlogs(blogs) {
            for (i in blogs) {
                UserService
                    .getUserById(blogs[i]._blogger)
                    .success(
                        function (user) {
                            blogs[i].bloggerName = user.username;
                        }
                    )
            }
            console.log(vm.blogs);
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

    function SingleBlogController($routeParams, $location, $rootScope, BlogService, UserService, CommentService) {
        var vm = this;
        vm.postComment = postComment;
        vm.getFormattedDate = getFormattedDate;
        vm.redirectSingleBlog = redirectSingleBlog;
        vm.logout=logout;
        vm.likeBlog = likeBlog;
        vm.blogId = $routeParams.blogId;
        vm.user = $rootScope.currentUser;
        function init() {
            BlogService
                .findBlogById(vm.blogId)
                .success(function (blog) {
                    vm.blog = blog;
                    UserService
                        .getUserById(blog._blogger)
                        .success(function (user) {
                            vm.blog.bloggerName = user.username;
                        });
                    if (vm.user && vm.blog.likes.indexOf(vm.user._id) == -1) {
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

        function redirectSingleBlog(blog) {
            if (blog._id) {
                $location.url("/blog/"+blog._id);
            } else {
                $location.url("/blog");
            }
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

    function EditBlogController($routeParams, $location, $rootScope, BlogService) {
        var vm = this;
        vm.updateBlog = updateBlog;
        vm.blogId = $routeParams.blogId;
        vm.logout=logout;
        vm.user = $rootScope.currentUser;

        function init() {
            BlogService
                .findBlogById(vm.blogId)
                .success(function (blog) {
                    if (vm.user._id != blog._blogger) {
                        $location.url("/blog");
                    }
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

    function NewBlogController($routeParams, $rootScope, $location, BlogService) {
        var vm = this;
        vm.createBlog = createBlog;
        vm.logout = logout;
        vm.findUserNameById = findUserNameById;
        vm.user = $rootScope.currentUser;
        
        function init() {

        }
        init();
        
        function createBlog(blog) {
            console.log("try create blog");
            BlogService
                .createBlog(vm.user._id, blog)
                .success(function (blog) {
                    $location.url("/blog/"+blog._id);
                });
        }

        function findUserNameById(userId) {
            UserService
                .getUserById(userId)
                .success(
                    function (user) {
                        return user.username;
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