/**
 * Created by BenYin on 3/31/17.
 */
(function () {
    angular
        .module("Spartan")
        .factory("Comment", CommentService);

    function CommentService($http) {
        var api = {
            "findCommentByBlogId": findCommentByBlogId
        }

        function findCommentByBlogId(blogId) {
            return $http.get("/api/blog/"+blogId+"/comment");
        }
    }
})();