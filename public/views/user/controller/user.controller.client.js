(function () {
    angular
        .module("Spartan")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController",ProfileController);
    function RegisterController($location,UserService,$rootScope) {
        var vm=this;
        vm.register=register;

        function init(){

            vm.service={value:false}
        }

        init();

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
                        console.log("login controller",user)
                        $rootScope.currentUser=user;
                        $location.path("/hahha");
                    }
                )
        }

    }
    
    function ProfileController() {
        
    }

})();