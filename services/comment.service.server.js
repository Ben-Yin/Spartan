/**
 * Created by BenYin on 3/31/17.
 */
module.exports = function (app, model) {
    app.get("/api/blog/:blogId/comment", findCommentByBlogId);

    function findCommentByBlogId(req, res) {
        var blogId = req.params.blogId;
        model
            .CommentModel
            .findCommentByPostId(blogId)
            .then(
                function (comments) {
                    res.json(comments);
                },
                function (err) {
                    res.sendStatus(500).send(err);
                }
            );
    }
};