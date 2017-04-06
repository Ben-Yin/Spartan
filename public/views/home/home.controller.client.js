/**
 * Created by Chaos on 4/6/2017.
 */
(function () {
    angular
        .module("Spartan")
        .controller("HomeController",HomeController);

    function HomeController($location,UserService,$rootScope) {
        var vm=this;
        vm.logout=logout;

        function init() {
            vm.user = $rootScope.currentUser;

        }
        init();
        function logout() {

            UserService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        vm.user.loggedin=false;
                        $location.url("/");
                    })}
    }
})();