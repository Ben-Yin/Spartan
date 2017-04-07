/**
 * Created by Chaos on 4/2/2017.
 */
(function () {
    'use strict';

    angular
        .module("Spartan")
        .factory("UserService",UserService);



    function UserService($http,$rootScope, $q) {
        var api = {
            "login": login,
            "logout": logout,
            "register": register,
            "getUserById": getUserById,
            "updateUser": updateUser
        };
        return api;

        function logout() {
            return $http.post("/api/logout");

        }

        function login(user) {
            return $http.post("/api/login", user);
        }

        function register(user) {
            return $http.post("/api/register", user);


        }

        function getUserById(userId) {
            return $http.get("/api/user/" + userId);
        }

        function updateUser(userId, updateUser) {
            return $http.put('/api/user/' + userId, updateUser);
        }
    }
})();