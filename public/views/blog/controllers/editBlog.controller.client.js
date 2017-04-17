/**
 * Created by BenYin on 3/31/17.
 */
(function () {
    angular
        .module("Spartan")
        .controller("EditBlogController", EditBlogController);

    function EditBlogController($routeParams, $location, $rootScope, BlogService, UserService) {
        var vm = this;
        vm.updateBlog = updateBlog;
        vm.logout=logout;
        vm.blogId = $routeParams.blogId;
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


})();