(function () {
    'use strict';
    angular
        .module("Spartan")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController",ProfileController)
        .controller("ProfileEditController",ProfileEditController);
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
            if(user.username!=null){
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
                vm.error="Please fill in Username!"
            }

        }
    }
    function LoginController($location,$rootScope,UserService) {
        var vm=this;
        vm.login=login;
        vm.logout=logout;

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
                        $location.path("/index");
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
        function init() {

            vm.user=$rootScope.currentUser;
        }
        init();

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





})();