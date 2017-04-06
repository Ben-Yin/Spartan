/**
 * Created by Chaos on 4/2/2017.
 */
(function () {
    angular
        .module("Spartan")
        .factory("UserService",UserService);



    function UserService($http,$rootScope, $q) {
        var api={
            "login":login,
            "logout":logout,
            "register":register,
            "setCurrentUser":setCurrentUser,
            "getCurrentUser":getCurrentUser
        }
        return api;

        function logout() {
            return $http.post("/api/logout");

        }

        function login(user) {
            return $http.post("/api/login",user);
        }

        function register(user) {
            return $http.post("/api/register",user);


        }
        function setCurrentUser(user) {
            $rootScope.user = user;
        }

        function getCurrentUser() {
            console.log("calling loggedin function");
            return $http.get("/api/assignment/users/loggedin");
        }
    }
})();