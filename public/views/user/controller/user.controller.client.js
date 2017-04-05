(function () {
    angular
        .module("Spartan")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController);
    function RegisterController($location,UserService,$rootScope) {
        var vm=this;
        vm.register=register;

        vm.user=[
            {
                label: "service",
                val:false
            },{
                label: "news",
                val:false
            }
        ]

        function register(user) {
            if(vm.user.service){
                if (user.password ==user.passwordCheck){
                    UserService
                        .register(user)
                        .then(function (res) {
                            var user=res.data;
                            $rootScope.currentUser=user;
                            $location.url("#/user/"+22)
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
    }
    function LoginController($location,$rootScope,UserService) {
        var vm=this;
        vm.login=login;

        function login(user) {
            console.log(user)
            UserService
                .login(user)
                .then(
                    function (res) {
                        var user=res.data;
                        console.log(user)
                        $rootScope.currentUser=user;
                        $location.url("/user/"+user._id);
                    }
                )
        }

    }

})();