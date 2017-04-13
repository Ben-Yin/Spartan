(function () {
    'use strict';
    angular
        .module("Spartan")
        .controller("AdminController", AdminController);
    function AdminController($location,UserService,$rootScope,$window,TrainingService,BlogService,PostService) {
        var vm=this;
        vm.logout=logout;

        function init(){
            vm.user=$rootScope.currentUser;
            setAllUsers();
            setAllTrainings();
            console.log(vm.trainings)
        }

        init();

        function setAllTrainings() {
            TrainingService.findAllTrainings()
                .success(
                    function (trainings) {
                        console.log("find",trainings)
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