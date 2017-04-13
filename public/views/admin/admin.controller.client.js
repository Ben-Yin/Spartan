(function () {
    'use strict';
    angular
        .module("Spartan")
        .controller("AdminController", AdminController);
    function AdminController($location,UserService,$rootScope,$window) {
        var vm=this;
        vm.turnToUserProfile=turnToUserProfile;
        vm.updateUser=updateUser;
        vm.deleteUser=deleteUser;
        vm.createUser=createUser;
        vm.logout=logout;

        function init(){
            vm.user=$rootScope.currentUser;
            setAllUsers();
        }

        init();

        function createUser(user) {
            UserService
                .register(user)
                .then(function (res) {
                    var user=res.data;
                    vm.singleuser=user
                })

        }
        function turnToUserProfile(user) {
            console.log("turn to user",user)
            vm.singleuser=user;
        }

        function deleteUser(userId) {
            UserService
                .deleteUser(userId)
                .success(
                    function (status) {
                        console.log(status)
                    }
                )
            setAllUsers();
        }
        function updateUser(updateUser) {
            UserService.updateUser(updateUser._id,updateUser)
                .then(
                    function (user) {
                        $window.alert("Update success!")
                        console.log("aa",user.config.data)
                        vm.singleuser=user.config.data;
                    }
                );
            setAllUsers();
        }
        function setAllUsers() {
            UserService.findAllUsers()
                .success(
                    function (users) {
                        var index=1
                        for (var i in users){
                            users[i].index=index;
                            index+=1;
                        }
                        vm.users=users;
                        console.log("setAll",users);
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