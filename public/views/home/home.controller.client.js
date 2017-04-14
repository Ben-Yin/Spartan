/**
 * Created by Chaos on 4/6/2017.
 */
(function () {
    angular
        .module("Spartan")
        .controller("HomeController",HomeController);

    function HomeController($sce,$location,$rootScope,UserService,BlogService,PostService,TrainingService) {
        var vm=this;
        vm.getFormattedDate = getFormattedDate;
        vm.logout=logout;
        vm.getYouTubeEmbedUrl=getYouTubeEmbedUrl;
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
                )
            TrainingService
                .findTrainingByConditions(null, null, "trending")
                .success(
                    function (trainings) {
                        if (trainings.length > 2) {
                            vm.trainings = trainings.slice(0, 2);
                        } else {
                            vm.trainings = trainings;
                        }
                    }
                );
        }
        init();
        function getYouTubeEmbedUrl(videoId) {
            // console.log(widgetUrl)
            var url = "https://www.youtube.com/embed/"+videoId;
            // console.log(url)
            return $sce.trustAsResourceUrl(url);
        }
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