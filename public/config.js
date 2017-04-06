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
                .when("/login", {
                    templateUrl: "/views/user/templates/login.view.client.html",
                    controller: "LoginController",
                    controllerAs: "model"
                })

                .when("/register", {
                    templateUrl: "/views/user/templates/register.view.client.html",
                    controller:"RegisterController",
                    controllerAs:"model"
                })

                .when("/profile", {
                    templateUrl: "/views/user/templates/profile.home.view.client.html",
                    controller:"ProfileController",
                    controllerAs:"model",
                    resolve: {
                        checkLoggedin: checkLoggedin
                    }
                })

                .when("/blog", {
                    templateUrl: "/views/blog/templates/blog-list.view.client.html",
                    controller: "BlogListController",
                    controllerAs: "model",
                    resolve: {
                        checkLoggedin: checkLoggedin
                    }
                })
                .when("/blog/:blogId", {
                    templateUrl: "/views/blog/templates/blog-single.view.client.html",
                    controller: "SingleBlogController",
                    controllerAs: "model",
                    resolve: {
                        checkLoggedin: checkLoggedin
                    }
                })
                .when("/blog/:blogId/edit", {
                    templateUrl: "/views/blog/templates/blog-edit.view.client.html",
                    controller: "EditBlogController",
                    controllerAs: "model",
                    resolve: {
                        checkLoggedin: checkLoggedin
                    }
                })
                .otherwise({
                    redirectTo: '/index'
                });



        }
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/loggedin').success(function(user) {
            console.log("checkLoggedin",user)
            $rootScope.errorMessage = null;
            if (user !== '0') {
                user.loggedin=true
                $rootScope.currentUser = user;
                deferred.resolve();
            } else {
                deferred.reject();
                $location.url('#/index');
            }
        });
        return deferred.promise;
    };
})();