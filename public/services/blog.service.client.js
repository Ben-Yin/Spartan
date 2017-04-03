/**
 * Created by BenYin on 3/31/17.
 */
(function () {
    angular
        .module("Spartan")
        .factory("BlogService", BlogService);
    
    function BlogService($http) {
        var api = {
            "createBlog": createBlog,
            "findBlogById": findBlogById,
            "findBlogByUserId": findBlogByUserId,
            "findBlogByConditions": findBlogByConditions,
            "updateBlog": updateBlog,
            "deleteBlog": deleteBlog,
            "addCommentForBlog": addCommentForBlog
        };
        return api;

        function createBlog(userId, blog) {
            return $http.post("/api/user/"+userId+"/blog", blog);
        }

        function findBlogById(blogId) {
            return $http.get("/api/blog/"+blogId);
        }

        function findBlogByUserId(userId) {
            return $http.get("/api/user/"+userId+"/blog");
        }

        function findBlogByConditions(blogNum, category, sorting) {
            return $http.get("/api/blog", {params: {
                "blogNum": blogNum,
                "category": category,
                "sorting": sorting
            }});
        }

        function updateBlog(blogId, blog) {
            return $http.put("/api/blog/"+blogId, blog);
        }

        function deleteBlog(blogId) {
            return $http.delete("/api/blog/"+blogId);
        }

        function addCommentForBlog(blogId, comment) {
            return $http.post("/api/user/"+userId+"/blog/"+blogId+"/comment", comment);
        }
    }
})();