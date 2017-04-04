(function(){
    angular
        .module("Spartan")
        .config(Config);
        function Config($routeProvider){
            $routeProvider
                .when("/", {
                    redirectTo: '/index'
                })
                .when("/index", {
                    templateUrl: "/index.view.client.html"
                })
                .when("/user", {
                    templateUrl: "/views/user/templates/login.view.client.html",
                    controller: "LoginController",
                    controllerAs: "model"
                })
                .when("/user/:uid", {
                    templateUrl: "/views/user/templates/profile.view.client.html",
                    controller: "ProfileController",
                    controllerAs: "model"
                })

                .when("/blog", {
                    templateUrl: "/views/blog/templates/blog-list.view.client.html",
                    controller: "BlogListController",
                    controllerAs: "model"
                })
                .when("/blog/:blogId", {
                    templateUrl: "/views/blog/templates/blog-single.view.client.html",
                    controller: "SingleBlogController",
                    controllerAs: "model"
                });

        }

})();