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
                    templateUrl: "/views/home/templates/index.view.client.html"
                })
                .when("/user", {
                    templateUrl: "/views/user/templates/login.view.client.html",
                    controller: "LoginController",
                    controllerAs: "model",
                    resolve: {loggedin:checkLoggedin}
                })

                .when("/register", {
                    templateUrl: "/views/user/templates/register.view.client.html",
                    controller:"RegisterController",
                    controllerAs:"model"
                })

                .when("/profile", {
                    templateUrl: "/views/user/templates/profile.home.view.client.html"
                })

                .when("/profile/edit", {
                    templateUrl: "/views/user/templates/profile.edit.view.client.html"
                })

                .when("/blog", {
                    templateUrl: "/views/blog/templates/blog-list.view.client.html",
                    controller: "BlogListController",
                    controllerAs: "model"
                });

            var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
                var deferred = $q.defer();
                $http.get('/api/loggedin').success(function(user) {
                    $rootScope.errorMessage = null;
                    if (user !== '0') {
                        $rootScope.currentUser = user;
                        deferred.resolve();
                    } else {
                        deferred.reject();
                        $location.url('/');
                    }
                });
                return deferred.promise;
            };


        }

})();