/**
 * Created by Chaos on 4/10/2017.
 */
module.exports=function () {
    var mongoose=require('mongoose');
    mongoose.Promise=require('bluebird');
    var TrainingSchema=require('./training.schema.server')();
    var TrainingModel=mongoose.model('TrainingModel',TrainingSchema);

    var api={
        createTraining:createTraining
    }
    return api;

    function createTraining(newTraning) {
        // console.log("training model",newTraning);
        return TrainingModel.create(newTraning)

    }
};