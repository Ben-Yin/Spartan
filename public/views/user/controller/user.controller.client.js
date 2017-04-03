(function () {
    angular
        .module("Spartan")
        .controller("LoginController", LoginController);

    function LoginController($location,$rootScope,UserService) {
        var vm=this;
        vm.login=login;

        function init() {

        }

        init();

        function login(user) {
            UserService.login(user)
                .then(
                    function (res) {
                        var user=res.data;
                        $rootScope.currentUser=user;
                        $location.url("/user/"+user._id);
                    }
                )
        }

    }

})();