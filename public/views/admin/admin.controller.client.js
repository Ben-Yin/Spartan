(function () {
    'use strict';
    angular
        .module("Spartan")
        .controller("AdminController", AdminController)
        .controller("AdminUserEditController",AdminUserEditController)
        .controller("AdminUserNewController",AdminUserNewController);
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
            UserService.updateUser(vm.editUserId,updateUser)
                .then(
                    function (user) {
                        $window.alert("Update success!")
                        console.log("aa",user.config.data)
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

        function init(){
            vm.user=$rootScope.currentUser;
            setAllUsers();
            setAllTrainings();
            setAllPosts();
            setAllBlogs();
        }

        init();

        function newUser() {
            console.log("aa")
            $location.url("/admin/new/user");
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
                        console.log(blogs);
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
                        // console.log(posts)
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
                        // console.log("setAll",users);
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