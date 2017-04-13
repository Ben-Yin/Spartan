(function () {
    'use strict';
    angular
        .module("Spartan")
        .controller("AdminController", AdminController);
    function AdminController($location,UserService,$rootScope) {
        var vm=this;
        vm.turnToUserProfile=turnToUserProfile;
        vm.updateUser=updateUser;
        vm.logout=logout;

        function init(){
            vm.user=$rootScope.currentUser;
            vm.createuser=true;
            setAllUsers();
        }

        init();

        function turnToUserProfile(user) {
            vm.singleuser=user;
            vm.createuser=false;
        }
        function updateUser(updateUser) {
            UserService.updateUser(updateUser._id,updateUser)
                .then(
                    function (user) {
                        $window.alert("Update success!")
                        console.log("aa",user.config.data)
                        $rootScope.currentUser=user.config.data;
                    }
                );
            setAllUsers()
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
                        console.log(users);
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