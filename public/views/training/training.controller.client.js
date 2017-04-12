(function () {
    'user strict';
    angular
        .module("Spartan")
        .controller("TrainingController",TrainingController)
        .controller("NewTrainingController",NewTrainingController)
        .controller("VideoController",VideoController);

    function VideoController($sce,$routeParams,$rootScope, $location,TrainingService, UserService, CommentService) {
        var vm=this;
        vm.getYouTubeEmbedUrl=getYouTubeEmbedUrl;
        vm.logout=logout;
        vm.postComment = postComment;
        vm.getFormattedDate = getFormattedDate;
        vm.deleteTraining = deleteTraining;
        vm.likeTraining = likeTraining;
        vm.trainingId = $routeParams.trainingId;
        function init() {
            vm.user=$rootScope.currentUser;
            console.log("user",vm.user)
            TrainingService.findTrainingById(vm.trainingId)
                .success(
                    function (training) {
                        vm.training=training;
                        console.log("training",vm.training);
                        UserService.getUserById(training._coach)
                            .success(function (coach) {
                                vm.training.coachName=coach.username;
                            });

                        if (!vm.user || vm.training.likes.indexOf(vm.user._id) == -1) {
                            vm.thumbsUp = {
                                "like": false,
                                "icon": "icon-large icon-thumbs-up-alt"
                            };
                        } else {
                            vm.thumbsUp = {
                                "like": true,
                                "icon": "icon-large icon-thumbs-up"
                            }
                        }
                    }
                );
            CommentService
                .findCommentByBlogId(vm.trainingId)
                .success(function (comments) {
                    vm.comments = comments;
                    for (var i in vm.comments) {
                        setCommenter(vm.comments[i]);
                    }
                });


        }
        init();

        function likeTraining(userId, training) {
            console.log(vm.thumbsUp.like,userId,training);
            if (vm.thumbsUp.like) {
                var i = training.likes.indexOf(userId);
                training.likes.splice(i, 1);
                vm.thumbsUp = {
                    "like": false,
                    "icon": "icon-large icon-thumbs-up-alt"
                }
            } else {
                training.likes.push(404);
                vm.thumbsUp = {
                    "like": true,
                    "icon": "icon-large icon-thumbs-up"
                }
            }
            TrainingService
                .updateTraining(training._id, training)
                .success(function (status) {
                    console.log("add like");
                });
        }

        function getYouTubeEmbedUrl(url) {
            // console.log(widgetUrl)
            return $sce.trustAsResourceUrl(url);
        }
        function getFormattedDate(dateStr) {
            var date = new Date(dateStr);
            return date.toDateString();
        }
        function deleteTraining(trainingId) {
            TrainingService.deleteTraining(trainingId)
                .success(
                    function (status) {
                        $location.url("/training/my/"+vm.user._id)
                    }
                )
        }
        function postComment(comment) {
            comment._post = vm.trainingId;
            if (vm.user) {
                comment._user = vm.user._id;
            } else {
                comment._user = null;
            }
            TrainingService
                .addCommentForTraining(vm.trainingId, comment)
                .success(function (newComment) {
                    console.log("add success",newComment);
                    CommentService
                        .findCommentByBlogId(vm.trainingId)
                        .success(function (comments) {
                            vm.comments = comments;
                            for (var i in vm.comments) {
                                setCommenter(vm.comments[i]);
                            }
                        });
                    vm.comment = null;
                },function (err) {
                    console.log(err);
                });
        }

        function setCommenter(comment) {
            UserService
                .getUserById(comment._user)
                .success(
                    function (user) {
                        comment.commenter = user.username;
                    }
                )
                .error(
                    function () {
                        comment.commenter = "Visitor";
                    }
                )
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



    function NewTrainingController($routeParams, $rootScope, $location,TrainingService,UserService) {
        var vm=this;
        vm.createTraining=createTraining;
        vm.logout = logout;
        function init() {
            vm.user=$rootScope.currentUser;
        }
        init();

        function createTraining(training) {
            var urlParts = training.videoUrl.split('/');
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/"+id;
            training.videoUrl=url;
            // console.log("controller",training);
            TrainingService
                .createTraining(vm.user._id,training)
                .success(
                    function (training) {
                        // console.log("create success!")
                        $location.url("/training/"+training._id);
                    }
                )

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
    function TrainingController($location,$filter,TrainingService,$rootScope,$sce) {
        var vm=this;
        vm.searchYoutube=searchYoutube;
        vm.getPhotoUrl = getPhotoUrl;
        vm.youtubeData=[];
        vm.nextPage="";
        vm.youtubeSearchText=""
        function init() {
            vm.user=$rootScope.currentUser;
        }
        init();

        function searchYoutube(searchText) {
            api_key=TrainingService.getApiKey();
            content = {
                params: {
                    key: "AIzaSyCE6iQJ7JkSdDLDEfzsIFu9dDddnYMSXS0",
                    type: 'video',
                    maxResult: 12,
                    pageToken: vm.nextPage ? vm.nextPage : "",
                    part: "id,snippet",
                    fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle,nextPageToken,prevPageToken',
                    q: searchText
                }
            };
            console.log(content);
            TrainingService
                .searchYoutube(content)
                .success(function (data) {
                    vm.youtubeData = data.items;
                    vm.youtubeSearchText = searchText;
                    vm.nextPageToken = data.nextPageToken;
                    vm.prevPageToken = data.prevPageToken;
                    // console.log("data",vm.youtubeData);
                });}

            vm.checkDataLength = function (data) {
                return (data.length >= 1);
            };

            vm.callNextPageFn=function (nextPage) {
                vm.nextPage=nextPage;
                vm.searchYoutube(vm.youtubeSearchText)
            }



        function getPhotoUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }


        
    }

})();