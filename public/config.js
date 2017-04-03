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