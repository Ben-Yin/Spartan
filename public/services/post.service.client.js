/**
 * Created by BenYin on 4/9/17.
 */
(function () {
    angular
        .module("Spartan")
        .factory("PostService", PostService);

    function PostService($http) {
        var api = {
            "createPost": createPost,
            "findPostById": findPostById,
            "findPostByUserId": findPostByUserId,
            "findFollowingPostByUserId": findFollowingPostByUserId,
            "findPostByConditions": findPostByConditions,
            "updatePost": updatePost,
            "deletePost": deletePost,
            "addCommentForPost": addCommentForPost,
            'findAllPosts':findAllPosts,
            "findPostByPoster":findPostByPoster
        };
        return api;

        function findPostByPoster(name) {
            return $http.get("/api/find/posts/by/"+name);
        }
        function findAllPosts() {
            return $http.get("/api/find/posts");
        }
        function createPost(userId, post) {
            return $http.post("/api/user/"+userId+"/post", post);
        }

        function findPostById(postId) {
            return $http.get("/api/post/"+postId);
        }

        function findPostByUserId(userId) {
            return $http.get("/api/user/"+userId+"/post");
        }

        function findFollowingPostByUserId(userId) {
            return $http.get("/api/post/following/"+userId);
        }
        
        function findPostByConditions(key, sorting) {
            return $http.get("/api/post", {params: {
                "key": key,
                "sorting": sorting
            }});
        }

        function updatePost(postId, post) {
            return $http.put("/api/post/"+postId, post);
        }

        function deletePost(postId) {
            return $http.delete("/api/post/"+postId);
        }

        function addCommentForPost(postId, comment) {
            return $http.post("/api/post/"+postId+"/comment", comment);
        }
    }
})();