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
                    templateUrl: "/views/home/templates/index.view.client.html",
                    controller:"HomeController",
                    controllerAs:"model",
                    resolve: {
                        getLoggedIn: getLoggedIn
                    }

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
                    controllerAs: "model"
                })
                .when("/blog/my", {
                    templateUrl: "/views/blog/templates/blog-list.view.client.html",
                    controller: "BlogListController",
                    controllerAs: "model",
                    resolve: {
                        checkLoggedin: checkLoggedin
                    }
                })
                .when("/blog/new", {
                    templateUrl: "/views/blog/templates/blog-new.view.client.html",
                    controller: "NewBlogController",
                    controllerAs: "model",
                    resolve: {
                        checkLoggedin: checkLoggedin
                    }
                })
                .when("/blog/:blogId", {
                    templateUrl: "/views/blog/templates/blog-single.view.client.html",
                    controller: "SingleBlogController",
                    controllerAs: "model"
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
    function checkLoggedin($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/loggedin').success(function(user) {
            console.log("checkLoggedin",user);
            $rootScope.errorMessage = null;
            if (user !== '0') {
                user.loggedin=true;
                $rootScope.currentUser = user;
                deferred.resolve();
            } else {
                deferred.reject();
                $location.url('/index');
            }
        });
        return deferred.promise;
    }

    function getLoggedIn($q, $http, $rootScope, $timeout) {

        var deferred = $q.defer();

        $http.get('/api/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.user = user;
            }
            deferred.resolve();
        });

        return deferred.promise;
    }
})();