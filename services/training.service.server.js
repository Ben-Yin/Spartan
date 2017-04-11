/**
 * Created by Chaos on 4/10/2017.
 */
module.exports = function (app, model) {
    app.get("/api/google_api", getApiKey);
    app.post("/api/coach/:coachId/training",createTraining);

    function createTraining(req,res) {
        var newTraining=req.body;
        var coachId=req.params.coachId;
        newTraining._coach=coachId;
        // console.log("create server side",newTraining);
        model
            .TrainingModel
            .createTraining(newTraining)
            .then(
                function (training) {
                    // console.log("create training",training);
                    res.json(training)
                },function (err) {
                    console.log(err)
                    res.sendStatus(500);
                }
            )
    }

    function getApiKey(req,res) {
        res.json(process.env.API_KEY);
    }
};
