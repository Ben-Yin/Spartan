/**
 * Created by BenYin on 4/10/17.
 */
(function () {
    angular
        .module("Spartan")
        .controller("NewPostController", NewPostController);

    function NewPostController($rootScope, $location, UserService) {
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
                        $location.url("/");
                    });
        }
    }
})();