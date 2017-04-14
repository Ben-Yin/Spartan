/**
 * Created by BenYin on 4/13/17.
 */
(function () {
    angular
        .module("Spartan")
        .controller("BMIController", bmiController);
    
    function bmiController($location, $rootScope, UserService, BMIService) {
        var vm = this;
        vm.calculateBMI = calculateBMI;
        vm.logout = logout;
        function init() {
            vm.user = $rootScope.currentUser;
            if (vm.user) {
                vm.bmi = {
                    weight: vm.user.weight,
                    height: vm.user.height,
                    sex: vm.user.sex,
                    age: vm.user.age
                }
            } else {
                vm.bmi = {
                    weight: {},
                    height: {}
                };
            }
        }
        init();

        function calculateBMI(bmi) {
            vm.alertMessage = null;
            if (!bmi.weight.value) {
                vm.alertMessage = "Missing weight!";
                return;
            }
            if (!bmi.weight.unit) {
                vm.alertMessage = "Missing weight unit!";
                return;
            }
            if (!bmi.height.value) {
                vm.alertMessage = "Missing height!";
                return;
            }
            if (!bmi.height.unit) {
                vm.alertMessage = "Missing height unit!";
                return;
            }
            if (!bmi.sex) {
                vm.alertMessage = "Missing gender!";
                return;
            }
            if (!bmi.age) {
                vm.alertMessage = "Missing age!";
                return;
            }
            if (vm.user) {
                vm.user.weight = bmi.weight;
                vm.user.height = bmi.height;
                vm.user.sex = bmi.sex;
                vm.user.age = bmi.age;
                UserService.updateUser(vm.user._id, vm.user);
            }
            if (bmi.sex=="Male") {
                var sex = "m";
            } else {
                sex = "f";
            }
            BMIService
                .requestBMICalculatorAPI(bmi.weight, bmi.height, sex, bmi.age)
                .success(
                    function (result) {
                        vm.result = result;
                        if (vm.result.bmi.status.indexOf("healthy") != -1 || vm.result.bmi.risk.indexOf("healthy") != -1) {
                            vm.bmiClass = "panel panel-success"
                        } else if (vm.result.bmi.status.indexOf("Overweight") != -1 || vm.result.bmi.risk.indexOf("Underweight") != -1) {
                            vm.bmiClass = "panel panel-warning";
                        } else {
                            vm.bmiClass = "panel panel-danger";
                        }
                    }
                );
        }

        function logout() {
            UserService
                .logout()
                .then(
                    function(response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    });
        }
    }
})();