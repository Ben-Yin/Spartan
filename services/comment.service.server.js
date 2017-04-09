/**
 * Created by BenYin on 3/31/17.
 */
module.exports = function (app, model) {
    app.get("/api/blog/:id/comment", findCommentByBlogId);

    function findCommentByBlogId(req, res) {
        var id = req.params.id;
        model
            .CommentModel
            .findCommentByPostId(id)
            .then(
                function (comments) {
                    res.json(comments);
                },
                function (err) {
                    res.sendStatus(500);
                }
            );
    }
};