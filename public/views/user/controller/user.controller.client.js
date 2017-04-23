(function () {
    'use strict';
    angular
        .module("Spartan")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
        .controller("ProfileEditController", ProfileEditController)
        .controller("UserFollowingController", UserFollowingController)
        .controller("UserFavoriteController", UserFavoriteController);
    function RegisterController($location, UserService, $rootScope) {
        var vm = this;
        vm.register = register;
        vm.logout = logout;

        function init() {

            vm.service = {value: false}
        }

        init();
        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    })
        }

        function register(user) {
            if (user && user.username != null && user.usertype != null) {
                if (vm.user.service) {
                    if (user.password == user.passwordCheck && user.password) {
                        // console.log("input user",user)
                        user.loggedin = true;
                        UserService
                            .register(user)
                            .success(function (res) {
                                var user = res;
                                $rootScope.currentUser = user;
                                vm.user = user;
                                $location.path("/profile")
                            })
                            .error(
                                function () {
                                    vm.error = "Username exists! Please try another username"
                                }
                            )
                    }
                    else {
                        vm.error = "Password doesn't match!"
                    }

                }
                else {
                    vm.error = "Please agree to Terms of Service!"
                }
            }
            else {
                vm.error = "Please fill in Username and select Usertype!"
            }

        }
    }

    function LoginController($location, $rootScope, UserService) {
        var vm = this;
        vm.login = login;
        vm.logout = logout;

        function init() {

        }

        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    })
        }

        function login(user) {
            if (user == null) {
                vm.error = "Please fill the required fields";
                return;
            }
            UserService
                .login(user)
                .then(
                    function (res) {
                        var user = res.data;
                        $rootScope.currentUser = user;
                        vm.user = user;
                        if (user.usertype == "Admin") {
                            $location.path("/admin");
                        } else {
                            $location.path("/index");
                        }

                    }, function (err) {
                        vm.error = "Username or password is Wrong";
                    }
                )

        }

    }

    function ProfileController($location, $rootScope, UserService, BlogService, TrainingService) {
        var vm = this;
        vm.logout = logout;
        vm.setFollowerNum = setFollowerNum;

        function init() {
            vm.user = $rootScope.currentUser;
            var maxNum = 4;
            if (vm.user.usertype == "MemberShip") {
                UserService
                    .getUserFollowing(vm.user._id)
                    .success(
                        function (followings) {
                            if (followings.length > maxNum) {
                                vm.following = followings.slice(0, maxNum);
                            } else {
                                vm.following = followings;
                            }
                        }
                    );
                UserService
                    .getUserFollower(vm.user._id)
                    .success(
                        function (followers) {
                            if (followers.length > maxNum) {
                                vm.followers = followers.slice(0, maxNum);
                            } else {
                                vm.followers = followers;
                            }
                            vm.followerNum = vm.followers.length;
                        }
                    );
                BlogService
                    .findBlogByConditions(null, null, "trending")
                    .success(
                        function (blogs) {
                            if (blogs.length > maxNum) {
                                vm.blogs = blogs.slice(0, maxNum);
                            } else {
                                vm.blogs = blogs;
                            }
                        }
                    );
                TrainingService
                    .findTrainingByUserId(vm.user._id)
                    .success(
                        function (courses) {
                            if (courses.length > maxNum) {
                                vm.courses = courses.slice(0, maxNum);
                            } else {
                                vm.courses = courses;
                            }
                        }
                    );
            } else if (vm.user.usertype == "Coach") {
                UserService
                    .countFollowerById(vm.user._id)
                    .success(
                        function (res) {
                            vm.followerNum = res.followerNum;
                        }
                    )
                TrainingService
                    .findTrainingByCoachId(vm.user._id)
                    .success(
                        function (courses) {
                            if (courses.length > maxNum) {
                                vm.courses = courses.slice(0, maxNum);
                            } else {
                                vm.courses = courses;
                            }
                        }
                    );
            }

        }

        init();

        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    })
        }

        function setFollowerNum(userId) {
            UserService
                .countFollowerById(userId)
                .success(
                    function (res) {
                        vm.user.followerNum = res.followerNum;
                    }
                );
        }


    }

    function ProfileEditController($location, $rootScope, UserService, $window) {
        var vm = this;
        vm.logout = logout;
        vm.update = update;
        vm.updatePass = updatePass;
        vm.delete = deleteUser;
        vm.updateAvatar = updateAvatar;

        function init() {

            vm.user = $rootScope.currentUser;
            UserService
                .countFollowerById(vm.user._id)
                .success(
                    function (res) {
                        vm.followerNum = res.followerNum;
                    }
                )
        }

        init();
        function deleteUser(user) {
            // console.log("delete user",user)
            if (user.confirmDelete == user.username) {
                UserService.deleteUser(user._id)
                    .success(function () {
                        UserService
                            .logout()
                            .then(
                                function (response) {
                                    $rootScope.currentUser = null;
                                    $location.url("/");
                                })
                    })
                    .error(function () {
                        $window.alert('Unable to remove user');
                    });
            } else {
                $window.alert('Please re-enter the username!');
            }

        }

        function updatePass(pass) {
            console.log(pass)
            var originPass = pass.originPass;
            var newpass = pass.newpass;
            var newpassCheck = pass.newpassCheck;

            var password = {
                originPass: originPass,
                newpass: newpass,
                encryptPass: vm.user.password
            }
            if (newpass == newpassCheck && newpass) {
                UserService.updatePass($rootScope.currentUser._id, password)
                    .then(
                        function (user) {
                            if (user) {
                                $window.alert("Update Password!")
                            }
                            else {
                                $window.alert("Password Wrong!");
                            }
                        }
                    )
            } else {
                $window.alert("Password doesn't match!");
            }

        }

        function update(user) {
            var updateUser = vm.user;
            UserService.updateUser($rootScope.currentUser._id, updateUser)
                .then(
                    function (user) {
                        $window.alert("Update success!")
                        console.log("aa", user.config.data)
                        $rootScope.currentUser = user.config.data;
                    }
                )
        }

        function updateAvatar() {
            const file = vm.upload;
            if (file == null) {
                return alert('No file selected.');
            }
            requestUpload(file);
        }

        function requestUpload(file) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', "/api/sign-s3?fileName=" + file.name + "&fileType=" + file.type);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        return upload(file, response.signedRequest, response.url);
                    }
                    else {
                        alert('Could not get signed URL.');
                    }
                }
            };
            xhr.send();
        }

        function upload(file, signedRequest, url) {
            console.log(file);
            const xhr = new XMLHttpRequest();
            var status = 0;
            xhr.open('PUT', signedRequest);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status == 200) {
                        status = xhr.status;
                        vm.user.avatar = url;
                        update(vm.user)
                    }
                    else {
                        alert('Could not upload file.');
                    }
                }
            };
            return xhr.send(file);
        }

        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    })
        }

    }


    function UserFollowingController($location, $rootScope, $routeParams, UserService) {
        var vm = this;
        vm.setFollowing = setFollowing;
        vm.setFollower = setFollower;
        vm.followUser = followUser;
        vm.logout = logout;
        function init() {
            vm.user = $rootScope.currentUser;
            UserService
                .getUserById($routeParams.userId)
                .then(
                    function (user) {
                        vm.reqUser = user.data;
                        return UserService.getUserFollowing(vm.reqUser._id);
                    }
                )
                .then(
                    function (followings) {
                        vm.followings = followings.data;
                        for (var i in vm.followings) {
                            setFollow(vm.followings[i]);
                        }
                        return UserService.getUserFollower(vm.reqUser._id);
                    }
                )
                .then(
                    function (followers) {
                        vm.followers = followers.data;
                        for (var i in vm.followers) {
                            setFollow(vm.followers[i]);
                        }
                        if ($location.url().indexOf("following") != -1) {
                            vm.title = vm.reqUser.username + "'s following";
                            vm.userList = vm.followings;
                        } else {
                            vm.title = vm.reqUser.username + "'s follower";
                            vm.userList = vm.followers;
                        }
                        console.log(vm.userList);
                    }
                )
        }

        init();

        function setFollowing() {
            vm.userList = vm.followings;
        }

        function setFollower() {
            vm.userList = vm.followers;
        }

        function followUser(user) {
            if (!vm.user) {
                $location.url("/register");
            }
            var userId = user._id;
            var userIndex = vm.user.following.indexOf(userId);
            if (userIndex != -1) {
                vm.user.following.splice(userIndex, 1);
            } else {
                vm.user.following.push(userId);
            }
            UserService
                .updateUser(vm.user._id, vm.user)
                .success(
                    function () {
                        setFollow(user);
                    }
                );
        }

        function setFollow(user) {
            if (vm.user && vm.user._id != user._id) {
                user.follow = {
                    showFollow: true
                };
                if (vm.user.following.indexOf(user._id) != -1) {
                    user.follow.followBtn = "btn btn-info active pull-right";
                    user.follow.text = "Following";
                } else {
                    user.follow.followBtn = "btn btn-info pull-right";
                    user.follow.text = "Follow";
                }
            }
        }

        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    })
        }
    }

    function UserFavoriteController($sce, $routeParams, $rootScope, $location, TrainingService, UserService) {

        var vm = this;
        vm.coachId = $rootScope.currentUser._id;
        vm.getFormattedDate = getFormattedDate;
        vm.getYouTubeEmbedUrl = getYouTubeEmbedUrl;
        vm.logout = logout;

        function init() {
            vm.user = $rootScope.currentUser;
            var favorites = vm.user.storecourse;
            vm.spartanTraining = [];
            for (var i in favorites) {
                TrainingService.findTrainingById(favorites[i])
                    .success(
                        function (training) {
                            vm.spartanTraining.push(training)
                        }
                    )
            }


        };
        init();
        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    });
        }

        function setCoachForTraining(training) {
            UserService
                .getUserById(training._coach)
                .success(
                    function (user) {
                        training.coachName = user.username;
                    }
                )
        }

        function getFormattedDate(dateStr) {
            var date = new Date(dateStr);
            // console.log(date);
            return date.toDateString();
        }

        function getYouTubeEmbedUrl(videoId) {
            // console.log(widgetUrl)
            var url = "https://www.youtube.com/embed/" + videoId;
            // console.log(videoId)
            return $sce.trustAsResourceUrl(url);
        }
    }


})();