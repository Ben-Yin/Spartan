/**
 * Created by BenYin on 3/31/17.
 */
(function () {
    angular
        .module("Spartan")
        .factory("CommentService", CommentService);

    function CommentService($http) {
        var api = {
            "findCommentByBlogId": findCommentByBlogId
        };
        return api;

        function findCommentByBlogId(blogId) {
            return $http.get("/api/blog/"+blogId+"/comment");
        }


    }
})();