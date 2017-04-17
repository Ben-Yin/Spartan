/**
 * Created by BenYin on 4/10/17.
 */
(function () {
    angular
        .module("Spartan")
        .controller("NewPostController", NewPostController);

    function NewPostController($rootScope, $location, UserService, PostService) {
        var vm = this;
        vm.uploadFile = uploadFile;
        vm.logout = logout;

        function init() {
            vm.user = $rootScope.currentUser;
            vm.post = {
                "_poster": vm.user._id,
                "posterName": vm.user.username
            };
        }
        init();

        function uploadFile() {
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
                        vm.post.imageUrl = url;
                        PostService
                            .createPost(vm.user._id, vm.post)
                            .success(
                                function () {
                                    $location.url("/post/");
                                }
                            )
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
                    });
        }
    }
})();