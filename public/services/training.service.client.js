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
            "createTraining":createTraining,
            "findTrainingById":findTrainingById,
            "findTrainingByUserId":findTrainingByUserId,
            "findTrainingByCoachId":findTrainingByCoachId,
            "findTrainingByConditions":findTrainingByConditions,
            "updateTraining":updateTraining,
            "deleteTraining":deleteTraining,
            "addCommentForTraining":addCommentForTraining,
            "findTrainingByVideoId":findTrainingByVideoId,
            "findAllTrainings":findAllTrainings
        }
        return api;
        function findAllTrainings() {
            return $http.get("/api/find/training")
        }
        function addCommentForTraining(trainingId, comment) {
            return $http.post("/api/training/"+trainingId+"/comment", comment);
        }
        function deleteTraining(trainingId) {
            return $http.delete("/api/training/"+trainingId);
        }
        function updateTraining(trainingId,training) {
            return $http.put("/api/training/"+trainingId, training);
        }
        function findTrainingByConditions(key,category,sorting) {
            return $http.get("/api/training",{params: {
                "key": key,
                "category": category,
                "sorting": sorting
            }});
        }
        function findTrainingByCoachId(coachId) {
           return $http.get("/api/coach/"+coachId+"/training");
        }
        function findTrainingByVideoId(videoId) {
           return $http.get("/api/video/"+videoId);
        }
        function findTrainingById(trainingId) {
            return $http.get("/api/training/"+trainingId);
        }
        function findTrainingByUserId(userId) {
            return $http.get("/api/user/"+userId+"/training");
        }
        function getApiKey() {
            return $http.get("/api/google_api")
        }
        function searchYoutube(content) {
            // console.log("training client")
            return $http.get('https://www.googleapis.com/youtube/v3/search',content)
        }

        function createTraining(coachId,training) {
            // console.log("client side ,create training",coachId,training);
            // console.log("/api/coach/"+coachId+"/training")
            return $http.post("/api/coach/"+coachId+"/training",training)
        }
    }
})();