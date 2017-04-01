(function(){
    angular
        .module("Spartan")
        .config(Config);
        function Config($routeProvider){
            $routeProvider
                .when("/", {
                    redirectTo: '/index'
<<<<<<< Updated upstream
                })
                .when("/index", {
                    templateUrl: "/index.view.client.html"
                });
||||||| merged common ancestors
                });
=======
                })
                .when("/blog", {
                    controller: "BlogController",
                    controllerAs: "model"
                })
>>>>>>> Stashed changes


        }

})();