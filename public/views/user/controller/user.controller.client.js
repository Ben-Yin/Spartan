(function () {
    'use strict';
    angular
        .module("Spartan")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController",ProfileController)
        .controller("ProfileEditController",ProfileEditController)
        .controller("UserFollowingController", UserFollowingController);
    function RegisterController($location,UserService,$rootScope) {
        var vm=this;
        vm.register=register;
        vm.logout=logout;

        function init(){

            vm.service={value:false}
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
        function register(user) {
            if(user.username!=null &&user.usertype!=null){
                if(vm.user.service){
                    if (user.password ==user.passwordCheck && user.password){
                        // console.log("input user",user)
                        user.loggedin=true;
                        UserService
                            .register(user)
                            .then(function (res) {
                                var user=res.data;
                                $rootScope.currentUser=user;
                                vm.user=user
                                console.log("vm",vm.user)
                                $location.path("/profile")
                            })
                    }
                    else{
                        vm.error="Password doesn't match!"
                    }

                }
                else{
                    vm.error="Please agree to Terms of Service!"
                }
            }
            else
            {
                vm.error="Please fill in Username and select Usertype!"
            }

        }
    }
    function LoginController($location,$rootScope,UserService) {
        var vm=this;
        vm.login=login;
        vm.logout=logout;

        function init() {

        }
        function logout() {
            UserService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    })}

        function login(user) {
            if (user == null) {
                vm.error="Please fill the required fields";
                return;
            }
            console.log(user)
                UserService
                    .login(user)
                    .then(
                        function (res) {
                            var user=res.data;
                            $rootScope.currentUser=user;
                            // console.log("login controller",user)
                            // console.log("$rootScope.currentUser",$rootScope.currentUser)
                            // console.log("vm.user",vm.user)
                            vm.user=user;
                            // console.log("vm.user",vm.user)
                            if(user.usertype=="Admin"){
                                $location.path("/admin");
                            }else {
                                $location.path("/index");
                            }

                        },function (err) {
                            vm.error="Username or password is Wrong";
                        }
                    )

        }

    }
    
    function ProfileController($location,$rootScope,UserService) {
        var vm=this
        vm.logout=logout;
        var vm=this;

        function init() {
            vm.user=$rootScope.currentUser;
            console.log(vm.user)
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


    }
    function ProfileEditController($location,$rootScope,UserService,$window) {
        var vm=this;
        vm.logout=logout;
        vm.update=update;
        vm.updatePass=updatePass;
        vm.delete=deleteUser;

        function init() {

            vm.user=$rootScope.currentUser;
            console.log("init",vm.user.avatar)
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
                                    $rootScope.currentUser = null;
                                    $location.url("/");
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
            console.log(pass)
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
            console.log(updateUser,$rootScope.currentUser._id)
            UserService.updateUser($rootScope.currentUser._id,updateUser)
                .then(
                    function (user) {
                        $window.alert("Update success!")
                        console.log("aa",user.config.data)
                        $rootScope.currentUser=user.config.data;
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


    function UserFollowingController($location, $rootScope, $routeParams, UserService) {
        var vm = this;
        vm.setFollowing = setFollowing;
        vm.setFollower = setFollower;
        vm.followUser = followUser;
        vm.logout = logout;
        function init() {
            vm.user = $rootScope.currentUser;
            UserService
                .getUserById($routeParams.userId)
                .then(
                    function (user) {
                        vm.reqUser = user.data;
                        return UserService.getUserFollowing(vm.reqUser._id);
                    }
                )
                .then(
                    function (followings) {
                        vm.followings = followings.data;
                        for (var i in vm.followings) {
                            setFollow(vm.followings[i]);
                        }
                        return UserService.getUserFollower(vm.reqUser._id);
                    }
                )
                .then(
                    function (followers) {
                        vm.followers = followers.data;
                        for (var i in vm.followers) {
                            setFollow(vm.followers[i]);
                        }
                        if ($location.url().indexOf("following") != -1) {
                            vm.title = vm.reqUser.username+"'s following";
                            vm.userList = vm.followings;
                        } else {
                            vm.title = vm.reqUser.username+"'s follower";
                            vm.userList = vm.followers;
                        }
                        console.log(vm.userList);
                    }
                )
        }
        init();

        function setFollowing() {
            vm.userList = vm.followings;
        }

        function setFollower() {
            vm.userList = vm.followers;
        }

        function followUser(user) {
            if (!vm.user) {
                $location.url("/register");
            }
            var userId = user._id;
            var userIndex = vm.user.following.indexOf(userId);
            if (userIndex != -1) {
                vm.user.following.splice(userIndex, 1);
            } else {
                vm.user.following.push(userId);
            }
            UserService
                .updateUser(vm.user._id, vm.user)
                .success(
                    function () {
                        setFollow(user);
                    }
                );
        }

        function setFollow(user) {
            if (vm.user && vm.user._id != user._id) {
                user.follow = {
                    showFollow: true
                };
                if (vm.user.following.indexOf(user._id) != -1) {
                    user.follow.followBtn = "btn btn-info active pull-right";
                    user.follow.text = "Following";
                } else {
                    user.follow.followBtn = "btn btn-info pull-right";
                    user.follow.text = "Follow";
                }
            }
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