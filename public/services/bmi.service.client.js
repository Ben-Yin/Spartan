/**
 * Created by BenYin on 4/13/17.
 */
(function () {
    angular
        .module("Spartan")
        .factory("BMIService", BMIService);

    function BMIService($http) {
        var api = {
            "requestBMICalculatorAPI": requestBMICalculatorAPI
        };
        return api;

        function requestBMICalculatorAPI(weight, height, sex, age) {
            return $http({
                method: "POST",
                url: "https://bmi.p.mashape.com/",
                headers: {
                    "Content-Type": "application/json",
                    "X-Mashape-Key": "Uw6kr2A8i7mshGZ8XVGz3lgqj5tmp1YQ1dCjsnxGHdrxrhdZm6",
                    "Accept": "application/json"
                },
                data: {
                    weight: weight,
                    height: height,
                    sex: sex,
                    age: age
                }
            });
        }
    }
})();