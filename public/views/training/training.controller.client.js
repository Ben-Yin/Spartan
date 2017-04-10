(function () {
    'user strict';
    angular
        .module("Spartan")
        .controller("TrainingController",TrainingController);
    
    function TrainingController($location,$filter,TrainingService,$rootScope) {
        var vm=this;
        vm.searchYoutube=searchYoutube;
        vm.youtubeData=[];
        vm.nextPage="";
        vm.youtubeSearchText=""
        function init() {
            vm.user=$rootScope.currentUser;
            vm.youtubeData=searchYoutube("fitness");
            console.log("youtube data",vm.youtubeData);
        }
        init();

        function searchYoutube(searchText) {
            api_key=TrainingService.getApiKey();
            content = {
                params: {
                    key: "AIzaSyCE6iQJ7JkSdDLDEfzsIFu9dDddnYMSXS0",
                    type: 'video',
                    maxResult: '12',
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
                });}

            vm.checkDataLength = function (data) {
                return (data.length >= 1);
            };

            vm.callNextPageFn=function (nextPage) {
                vm.nextPage=nextPage;
                vm.searchYoutube(vm.youtubeSearchText)
            }




        
    }
})();