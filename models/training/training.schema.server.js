/**
 * Created by Chaos on 4/10/2017.
 */
module.exports=function () {
    var mongoose = require('mongoose');
    return mongoose.Schema({
        _coach:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        category:String,
        description:String,
        title:String,
        videoUrl:String,
        source:String,
        likes:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }],
        createDate:{type:Date,default:Date.now()}
    },{collection:"training"});
};

