/**
 * Created by Chaos on 4/2/2017.
 */
(function () {
    angular
        .module("Spartan")
        .factory("UserService",UserService);
    function UserService($http) {
        var api={
            "login":login
        }

        function login(user) {
            return $http.post("/api/login",user);
        }
    }
})