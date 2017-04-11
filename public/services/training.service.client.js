/**
 * Created by Chaos on 4/10/2017.
 */
(function () {
    'use strict';

    angular
        .module("Spartan")
        .factory("TrainingService",TrainingService);

    function TrainingService($http,$rootScope) {

        var api={
            "searchYoutube":searchYoutube,
            "getApiKey":getApiKey,
            "createTraining":createTraining
        }
        return api;

        function getApiKey() {
            return $http.get("/api/google_api")
        }
        function searchYoutube(content) {
            // console.log("training client")
            return $http.get('https://www.googleapis.com/youtube/v3/search',content)
        }

        function createTraining(coachId,training) {
            console.log("client side ,create training",coachId,training);
            console.log("/api/coach/"+coachId+"/training")
            return $http.post("/api/coach/"+coachId+"/training",training)
        }
    }
})();