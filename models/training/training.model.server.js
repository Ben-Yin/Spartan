/**
 * Created by Chaos on 4/10/2017.
 */
module.exports=function () {
    var mongoose=require('mongoose');
    mongoose.Promise=require('bluebird');
    var TrainingSchema=require('./training.schema.server')();
    var TrainingModel=mongoose.model('TrainingModel',TrainingSchema);

    var api={
        createTraining:createTraining,
        findTrainingById:findTrainingById,
        findTrainingByCoachId:findTrainingByCoachId,
        findTrainingByConditions:findTrainingByConditions,
        updateTraining:updateTraining,
        deleteTraining:deleteTraining,
        addCommentForTraining:addCommentForTraining
    };
    return api;

    function createTraining(newTraning) {
        // console.log("training model",newTraning);
        return TrainingModel.create(newTraning)
    }

    function findTrainingById(trainingId) {
        return TrainingModel.findById(trainingId);
    }
    function findTrainingByCoachId(coachId) {
        return TrainingModel.findOne({"_coach":coachId}).sort({"createDate":-1});
    }
    function findTrainingByConditions(key,category,sorting) {
        var condition = {};
        if (key) {
            condition.title = new RegExp(key);
        }
        if (category) {
            condition.category = category;
        }
        var query = TrainingModel.find(condition);
        if (sorting == "trending") {
            query = query.sort({"likes": -1});
        } else if (sorting == "Date") {
            query = query.sort({"createDate": -1});
        }
        return query;
    }
    function updateTraining(trainingId,training) {
        return TrainingModel.update({_id:trainingId},{$set:training});
    }
    function deleteTraining(traniningId) {
        return TrainingModel.remove({_id:traniningId});
    }

    function addCommentForTraining(trainingId,comment) {
        console.log("add comment for training model")
        return TrainingModel.findById(trainingId,function (err,training) {
            if(err) return handleError(err);
            training.comments.push(comment);
            training.save();
        })
    }
};