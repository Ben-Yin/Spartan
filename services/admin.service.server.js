/**
 * Created by BenYin on 3/28/17.
 */
module.exports = function (app, model) {
    app.get("/api/admin/users", findAllUsers);
    app.get("/api/admin/posts", findAllPosts);
    app.get("/api/admin/stores", findAllStores);

    function findAllUsers(req, res) {

    }

    function findAllPosts(req, res) {

    }

    function findAllStores(req, res) {

    }
};