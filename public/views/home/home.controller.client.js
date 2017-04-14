/**
 * Created by Chaos on 4/6/2017.
 */
(function () {
    angular
        .module("Spartan")
        .controller("HomeController",HomeController);

    function HomeController($location,$rootScope,UserService,BlogService,PostService) {
        var vm=this;
        vm.getFormattedDate = getFormattedDate;
        vm.logout=logout;

        var months = ["Jan.","Feb.","Mar.","Apr.","May","Jun.","Jul.","Aug","Sep.","Oct.","Nov,","Dec."];
        function init() {
            vm.user = $rootScope.currentUser;
            BlogService
                .findBlogByConditions(null, null, "trending")
                .success(
                    function (blogs) {
                        if (blogs.length > 3) {
                            vm.blogs = blogs.slice(0, 3);
                        } else {
                            vm.blogs = blogs;
                        }
                        for (var i in vm.blogs) {
                            vm.blogs[i].dateView = getFormattedDate(vm.blogs[i].blogDate);
                        }
                    }
                );
            PostService
                .findPostByConditions(null, "trending")
                .success(
                    function (posts) {
                        if (posts.length > 6) {
                            vm.posts = posts.slice(0, 6);
                        } else {
                            vm.posts = posts;
                        }
                    }
                );
        }
        init();

        function getFormattedDate(dateStr) {
            var date = new Date(dateStr);
             return {
                "date": date.getDate(),
                "month": months[date.getMonth()],
                "year": date.getYear()
            };
        }

        function logout() {
            UserService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        vm.user.loggedin=false;
                        $location.url("/");
                    })
        }
    }
})();