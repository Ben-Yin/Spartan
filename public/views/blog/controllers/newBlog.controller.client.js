/**
 * Created by BenYin on 3/31/17.
 */
(function () {
    angular
        .module("Spartan")
        .controller("NewBlogController", NewBlogController);

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