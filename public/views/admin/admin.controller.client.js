(function () {
    'use strict';
    angular
        .module("Spartan")
        .controller("AdminController", AdminController)
        .controller("AdminUserEditController",AdminUserEditController)
        .controller("AdminUserNewController",AdminUserNewController)
        .controller('AdminPostNewController',AdminPostNewController)
        .controller("AdminBlogNewController",AdminBlogNewController)
        .controller("AdminTrainingNewController",AdminTrainingNewController)
        .controller("AdminBlogEditController",AdminBlogEditController)
        .controller("AdminTrainingEditController",AdminTrainingEditController);

    function AdminBlogEditController($routeParams, $location, $rootScope, BlogService) {
        var vm = this;
        vm.updateBlog = updateBlog;
        vm.blogId = $routeParams.blogId;
        vm.logout=logout;
        vm.user = $rootScope.currentUser;

        function init() {
            BlogService
                .findBlogById(vm.blogId)
                .success(function (blog) {
                    vm.blog = blog;
                    vm.title = vm.blog.title;
                });
        }
        init();

        function updateBlog(blog) {
            BlogService
                .updateBlog(vm.blogId, blog)
                .success(function (status) {
                    $location.url("/admin");
                });
        }

        function deleteBlog(blogId) {
            BlogService
                .deleteBlog(blogId)
                .success(function (status) {
                    $location.url("/admin");
                });
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
    function AdminTrainingEditController($routeParams,$rootScope, $location,TrainingService,UserService) {
        var vm=this;
        vm.updateTraining=updateTraining;
        vm.logout = logout;
        vm.trainingId = $routeParams.trainingId;
        function init() {
            vm.user=$rootScope.currentUser;
            TrainingService
                .findTrainingById(vm.trainingId)
                .success(
                    function (training) {
                        training.videoUrl="https://youtu.be/"+training.videoUrl;
                        vm.training=training;
                    }
                )
        }
        init();

        function updateTraining(training) {
            var urlParts = training.videoUrl.split('/');
            var id = urlParts[urlParts.length - 1];
            training.videoUrl=id;
            // console.log("controller",training);
            console.log(training._coach)
            TrainingService
                .updateTraining(training._id,training)
                .success(
                    function (training) {
                        // console.log("create success!")
                        $location.url("/admin");
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
    
    function AdminTrainingNewController($routeParams, $rootScope, $location,TrainingService,UserService) {
        var vm=this;
        vm.createTraining=createTraining;
        vm.logout = logout;
        function init() {
            vm.user=$rootScope.currentUser;
        }
        init();

        function createTraining(training) {
            var urlParts = training.videoUrl.split('/');
            var id = urlParts[urlParts.length - 1];
            training.videoUrl=id;
            training.source="Spartan College";
            training.coachName=vm.user.username;
            // console.log("controller",training);
            TrainingService
                .createTraining(vm.user._id,training)
                .success(
                    function (training) {
                        // console.log("create success!")
                        $location.url("/admin");
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


    function AdminBlogNewController($routeParams, $rootScope, $location, BlogService) {
        var vm = this;
        vm.createBlog = createBlog;
        vm.logout = logout;

        function init() {
            vm.user = $rootScope.currentUser;
        }
        init();

        function createBlog(blog) {
            blog.bloggerName=vm.user.username;
            BlogService
                .createBlog(vm.user._id, blog)
                .success(function (blog) {
                    $location.url("/admin");
                });
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

    function AdminPostNewController($rootScope) {
        var vm = this;
        vm.logout = logout;
        function init() {
            vm.user = $rootScope.currentUser;
        }
        init();


        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/admin");
                    });
        }
    }
    function AdminUserNewController($location,UserService,$rootScope) {
        var vm=this;
        vm.create=create;
        vm.logout=logout;
        function init(){
            vm.user=$rootScope.currentUser;

        }
        init();
        function logout() {
            UserService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    })}
        function create(user) {
            if(user.username!=null &&user.usertype!=null){
                UserService
                    .create(user)
                    .then(function (res) {
                        $location.path("/admin")
                    })


        }
    }}
    function AdminUserEditController($location,$rootScope,UserService,$window,$routeParams) {
        var vm=this;
        vm.logout=logout;
        vm.update=update;
        vm.updatePass=updatePass;
        vm.delete=deleteUser;
        vm.editUserId=$routeParams.userId;

        function init() {
            UserService.getUserById(vm.editUserId)
                .success(function (user) {
                    vm.editUser=user;
                    console.log("editUser",vm.editUser);
                })
            vm.user=$rootScope.currentUser;

        }


        init();
        function deleteUser(user) {
            // console.log("delete user",user)
            if(user.confirmDelete==user.username)
            {
                UserService.deleteUser(user._id)
                    .success(function () {
                        UserService
                            .logout()
                            .then(
                                function(response) {
                                    $location.url("/admin");
                                })
                    })
                    .error(function () {
                        $window.alert('Unable to remove user');
                    });
            }else{
                $window.alert('Please re-enter the username!');
            }

        }
        function updatePass(pass) {

            var originPass=pass.originPass;
            var newpass=pass.newpass;
            var newpassCheck=pass.newpassCheck;

            var password={
                originPass:originPass,
                newpass:newpass,
                encryptPass:vm.user.password
            }
            if(newpass==newpassCheck && newpass){
                UserService.updatePass(vm.editUserId,password)
                    .then(
                        function (user) {
                            if(user)
                            {$window.alert("Update Password!")}
                            else{$window.alert("Password Wrong!");}
                        }
                    )
            }else{
                $window.alert("Password doesn't match!");
            }

        }
        function update(user) {
            var updateUser=vm.editUser;
            // console.log(updateUser,$rootScope.currentUser._id)
            UserService.updateUser(updateUser._id,updateUser)
                .then(
                    function (user) {
                        $window.alert("Update success!")
                        $location.url("/admin");
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
                    })}

    }
    function AdminController($location,UserService,$rootScope,$window,TrainingService,BlogService,PostService) {
        var vm=this;
        vm.logout=logout;
        vm.update=update;
        vm.updatePass=updatePass;
        vm.newUser=newUser;
        vm.newPost=newPost;
        vm.newBlog=newBlog;
        vm.newTraining=newTraining;
        vm.deleteUser=deleteUser;
        vm.deletePost=deletePost;
        vm.deleteBlog=deleteBlog;
        vm.deleteTraining=deleteTraining;
        vm.searchUser=searchUser;

        function init(){
            vm.user=$rootScope.currentUser;
            setAllUsers();
            setAllTrainings();
            setAllPosts();
            setAllBlogs();
        }

        init();
        function searchUser(text) {

        }
        function deleteTraining(trainingId) {
            TrainingService.deleteTraining
                .success(
                    function (status) {
                        setAllTrainings();
                    }
                )
        }
        function deletePost(postId) {
            PostService.deletePost(postId)
                .success(
                    function (status) {
                        setAllPosts();
                    }
                )
        }
        function deleteBlog(blogId) {
            BlogService.deleteBlog(blogId)
                .success(
                    function (status) {
                        setAllBlogs();
                    }
                )
        }
        function deleteUser(userId) {
            UserService.deleteUser(userId)
                .success(
                    function (status) {
                        setAllUsers();
                    }
                )
        }
        function newTraining() {
            $location.url("/admin/new/training");
        }
        function newBlog() {
            // console.log("aa")
            $location.url("/admin/new/blog");
        }
        
        function newUser() {
            // console.log("aa")
            $location.url("/admin/new/user");
        }
        function newPost() {
            $location.url("/admin/new/post");
        }
        function updatePass(pass) {
            // console.log(pass)
            var originPass=pass.originPass;
            var newpass=pass.newpass;
            var newpassCheck=pass.newpassCheck;

            var password={
                originPass:originPass,
                newpass:newpass,
                encryptPass:vm.user.password
            }
            if(newpass==newpassCheck && newpass){
                UserService.updatePass($rootScope.currentUser._id,password)
                    .then(
                        function (user) {
                            if(user)
                            {$window.alert("Update Password!")}
                            else{$window.alert("Password Wrong!");}
                        }
                    )
            }else{
                $window.alert("Password doesn't match!");
            }

        }
        function update(user) {
            var updateUser=vm.user;
            // console.log(updateUser,$rootScope.currentUser._id)
            UserService.updateUser($rootScope.currentUser._id,updateUser)
                .then(
                    function (user) {
                        $window.alert("Update success!");
                        $rootScope.currentUser=user.config.data;
                    }
                )
        }
        function setAllBlogs() {

            BlogService.findAllBlogs()
                .success(
                    function (blogs) {
                        var index=1;
                        for(var i in blogs){
                            blogs[i].index=index;
                            index+=1;
                        }
                        vm.blogs=blogs;
                        vm.blogAmount=blogs.length;
                    }
                )
        }
        function  setAllPosts() {
            PostService.findAllPosts()
                .success(
                    function (posts) {

                        var index=1;
                        for(var i in posts){
                            posts[i].index=index;
                            index+=1;
                        }
                        vm.posts=posts;
                        vm.postAmount=posts.length;
                    }
                )
        }
        function setAllTrainings() {
            TrainingService.findAllTrainings()
                .success(
                    function (trainings) {
                        // console.log("find",trainings)
                        var index=1;
                        for(var i in trainings){
                            trainings[i].index=index;
                            index+=1;
                        }
                        vm.trainings=trainings;
                        vm.trainingAmount=trainings.length;
                    }
                )
        }
        function setAllUsers() {
            UserService.findAllUsers()
                .success(
                    function (users) {
                        var index=1;
                        for (var i in users){
                            users[i].index=index;
                            index+=1;
                        }
                        vm.users=users;
                        vm.userAmount=users.length;
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
                    })}

    }


})();