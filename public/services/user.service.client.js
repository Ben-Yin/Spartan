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
            "updateUser": updateUser,
            "updatePass": updatePass,
            "findAllUsers":findAllUsers,
            "deleteUser": deleteUser,
            "getUserFollowing": getUserFollowing,
            "getUserFollower": getUserFollower,
            "countFollowerById": countFollowerById
        };
        return api;

        function deleteUser(userId) {
            return $http.delete("/api/user/"+userId);
        }
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

        function updatePass(userId, password) {
            return $http.put('/api/user/pass/' + userId, password);
        }

        function findAllUsers() {
            // console.log(type)
            return $http.get("/api/admin/find/");

        
        function getUserFollowing(userId) {
            console.log(userId);
            return $http.get("/api/user/"+userId+"/following");
        }

        function getUserFollower(userId) {
            return $http.get("/api/user/"+userId+"/follower");
        }

        function countFollowerById(userId) {
            return $http.get("/api/user/"+userId+"/followerNum");

        }
    }
})();