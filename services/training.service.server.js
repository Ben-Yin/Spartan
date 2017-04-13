/**
 * Created by Chaos on 4/10/2017.
 */
module.exports = function (app, model) {
    app.get("/api/google_api", getApiKey);
    app.post("/api/coach/:coachId/training",createTraining);
    app.get("/api/training/:trainingId", findTrainingById);
    app.get("/api/coach/:coachId/training", findTrainingByCoachId);
    app.get("/api/training", findTrainingByConditions);
    app.put("/api/training/:trainingId", updateTraining);
    app.delete("/api/training/:trainingId", deleteTraining);
    app.post("/api/training/:trainingId/comment", addCommentForTraining);
    app.get("/api/video/:videoId",findTrainingByVideoId);
    app.get("/api/find/training",findAllTrainings);

    function findAllTrainings(req,res) {
        model.TrainingModel.findAllTrainings()
            .then(
                function (trainings) {
                    res.json(trainings);
                },function (err) {
                    res.sendStatus(500);
                    console.log(1);
                }
            )
    }

    function findTrainingById(req,res) {
        var trainingId=req.params.trainingId;
        model.TrainingModel.findTrainingById(trainingId)
            .then(
                function (training) {
                    res.json(training);
                },function (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
            )
    }

    function findTrainingByVideoId(req,res) {

        var videoId=req.params.videoId;
        // console.log("videoId",videoId);
        model.TrainingModel.findTrainingByVideoId(videoId)
            .then(
                function (training) {
                    res.json(training)
                },function (err) {
                    console.log(err)
                }
            )
    }
    function findTrainingByCoachId(req,res) {
        var coachId=req.params.coachId;
        model.TrainingModel.findTrainingByCoachId(coachId)
            .then(
                function (training) {
                    res.json(training)
                },function (err) {
                    res.sendStatus(500).send(err);
                }
            )
    }
    function findTrainingByConditions(req,res) {
        var key=req.query.key;
        var category=req.query.category;
        var sorting=req.query.sorting;
        model.TrainingModel.findTrainingByConditions(key,category,sorting)
            .then(
                function (trainings) {
                    res.json(trainings)
                },function (err) {
                    res.sendStatus(500).send(err);
                }
            )
    }
    function updateTraining(req,res) {
        var trainingId=req.params.trainingId;
        var updateTraining=req.body;
        // console.log("server",trainingId,updateTraining)
        model.TrainingModel.updateTraining(trainingId,updateTraining)
            .then(function (status) {
                res.sendStatus(200);
            },function (err) {
                res.sendStatus(500).send(err);
            })
    }
    function deleteTraining(req,res) {
        var trainingId=req.params.trainingId;
        model.TrainingModel.findTrainingById(trainingId)
            .then(
                function (training) {
                    return model.Promise
                        .join(
                            model.CommentModel
                                .deleteComment(training.comments),
                            training.remove(),
                            function () {

                            }
                        )
                }
            )
            .then(
                function (status) {
                    res.sendStatus(200);
                },function (err) {
                    res.sendStatus(500).send(err);
                }
            )

    }
    function addCommentForTraining(req,res) {
        var trainingId=req.params.trainingId;
        var commet=req.body;
        model.CommentModel
            .createComment(commet)
            .then(
                function (newComment) {
                    return model.TrainingModel.addCommentForTraining(trainingId,newComment)
                },function (err) {
                    console.log(err)
                }
            )
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.sendStatus(500);
                }
            )
            .catch(
                function (err) {
                    res.sendStatus(500);
                }
            );
    }


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
        // console.log(process.env.API_KEY);
        res.json(process.env.API_KEY);
    }
};
