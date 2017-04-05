(function () {
    angular
        .module("Spartan")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController);
    function RegisterController($location,UserService,$rootScope) {
        var vm=this;
        vm.register=register;


        function register(user) {
            if(user.service==null){
                $location.url("#/user/"+user._id)
                vm.error="Please agree to Terms of Service!"
            }
            console.log(user)
            UserService
                .createUser(user)
                .then(function (res) {
                    var user=res.data;
                    $rootScope.currentUser=user;
                    $location.url("#/user/"+user._id)
                })
        }
    }
    function LoginController($location,$rootScope,UserService) {
        var vm=this;
        vm.login=login;

        function init() {

        }

        init();

        function login(user) {
        }

    }

})();