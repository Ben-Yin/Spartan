(function(){
    angular
        .module("Spartan")
        .config(Config);
        function Config($routeProvider){
            $routeProvider
                .when("/", {
                    redirectTo: '/index'
                })

                .when("/admin", {
                    templateUrl: "/views/admin/admin.view.client.html",
                    controller:"AdminController",
                    controllerAs:"model",
                    css: ['style_v1.css','style_v2.css'],
                    resolve: {
                        checkAdminLoggedIn: checkAdminLoggedIn
                    }

                })
                .when("/admin/edit/user/:userId", {
                templateUrl: "/views/admin/admin.update.user.view.client.html",
                controller:"AdminUserEditController",
                controllerAs:"model",
                resolve: {
                    checkAdminLoggedIn: checkAdminLoggedIn
                }

            })
                .when("/admin/new/user", {
                    templateUrl: "/views/admin/admin.new.user.view.client.html",
                    controller:"AdminUserNewController",
                    controllerAs:"model",
                    resolve: {
                        checkAdminLoggedIn: checkAdminLoggedIn
                    }

                })
                .when("/admin/new/post", {
                    templateUrl: "/views/admin/admin.new.post.view.client.html",
                    controller:"AdminPostNewController",
                    controllerAs:"model",
                    resolve: {
                        checkAdminLoggedIn: checkAdminLoggedIn
                    }
                })
                .when("/admin/new/blog", {
                    templateUrl: "/views/admin/admin.new.blog.view.client.html",
                    controller:"AdminBlogNewController",
                    controllerAs:"model",
                    resolve: {
                        checkAdminLoggedIn: checkAdminLoggedIn
                    }
                })
                .when("/admin/new/training", {
                    templateUrl: "/views/admin/admin.new.training.view.client.html",
                    controller:"AdminTrainingNewController",
                    controllerAs:"model",
                    resolve: {
                        checkAdminLoggedIn: checkAdminLoggedIn
                    }
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
                .when("/profile/edit", {
                    templateUrl: "/views/user/templates/profile.edit.view.client.html",
                    controller:"ProfileEditController",
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
                        getLoggedIn: getLoggedIn
                    }
                })
                .when("/blog/my/:userId", {
                    templateUrl: "/views/blog/templates/blog-list.view.client.html",
                    controller: "BlogListController",
                    controllerAs: "model",
                    resolve: {
                        getLoggedIn: getLoggedIn
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
                    controllerAs: "model",
                    resolve: {
                        getLoggedIn: getLoggedIn
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
                .when("/post", {
                    templateUrl: "/views/post/templates/post-list.view.client.html",
                    controller: "PostListController",
                    controllerAs: "model",
                    resolve: {
                        getLoggedIn: getLoggedIn
                    }
                })
                .when("/post/trend", {
                    templateUrl: "/views/post/templates/post-list.view.client.html",
                    controller: "PostListController",
                    controllerAs: "model",
                    resolve: {
                        getLoggedIn: getLoggedIn
                    }
                })
                .when("/post/my/:userId", {
                    templateUrl: "/views/post/templates/post-list.view.client.html",
                    controller: "PostListController",
                    controllerAs: "model",
                    resolve: {
                        getLoggedIn: getLoggedIn
                    }
                })
                .when("/post/new", {
                templateUrl: "/views/post/templates/post-new.view.client.html",
                controller: "NewPostController",
                controllerAs: "model",
                resolve: {
                    checkLoggedin: checkLoggedin
                }
            })
                .when("/training", {
                    templateUrl: "/views/training/templates/training-list.view.client.html",
                    controller:"TrainingController",
                    controllerAs:"model",
                    resolve: {
                        getLoggedIn: getLoggedIn
                    }
                })
                .when("/training/new", {
                    templateUrl: "/views/training/templates/training.new.view.client.html",
                    controller: "NewTrainingController",
                    controllerAs: "model",
                    resolve: {
                        checkCoachLoggedin: checkCoachLoggedin
                    }
                })
                .when("/training/:trainingId/edit", {
                    templateUrl: "/views/training/templates/training.edit.view.client.html",
                    controller: "EditTrainingController",
                    controllerAs: "model",
                    resolve: {
                        checkCoachLoggedin: checkCoachLoggedin
                    }
                })
                .when("/training/:trainingId", {
                    templateUrl: "/views/training/templates/video.view.client.html",
                    controller: "VideoController",
                    controllerAs: "model",
                    resolve: {
                        getLoggedIn: getLoggedIn
                    }
                })
                .when("/training/coach/:coachId", {
                    templateUrl: "/views/training/templates/coach.training.list.view.client.html",
                    controller: "CourseListController",
                    controllerAs: "model",
                    resolve: {
                        getLoggedIn: getLoggedIn
                    }
                })

                .when("/user/:userId/following", {
                    templateUrl: "/views/user/templates/user-list.view.client.html",
                    controller: "UserFollowingController",
                    controllerAs: "model",
                    resolve: {
                        getLoggedIn: getLoggedIn
                    }
                })
                .when("/user/:userId/follower", {
                    templateUrl: "/views/user/templates/user-list.view.client.html",
                    controller: "UserFollowingController",
                    controllerAs: "model",
                    resolve: {
                        getLoggedIn: getLoggedIn
                    }
                })
                .otherwise({
                    redirectTo: '/index'
                });



        }
    function checkLoggedin($q, $http, $location, $rootScope) {
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
    function checkCoachLoggedin($q, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/loggedin').success(function(user) {
            console.log("checkLoggedin",user);
            $rootScope.errorMessage = null;
            if (user !== '0'&& user.usertype=='Coach') {
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

    function checkAdminLoggedIn($q, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/loggedin').success(function(user) {
            // console.log("checkLoggedin",user);
            $rootScope.errorMessage = null;
            if (user !== '0'&& user.usertype=='Admin') {
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

        $http.get('/api/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0') {
                user.loggedin=true;
                $rootScope.currentUser = user;
                console.log("get user!!",user);
            }
            deferred.resolve();
        });

        return deferred.promise;
    }
})();