/**
 * Created by Chaos on 4/10/2017.
 */
module.exports = function (app, model) {
    app.get("/api/google_api", getApiKey);

    function getApiKey() {
        return process.env.API_KEY;
    }
};
