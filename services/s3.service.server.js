/**
 * Created by BenYin on 4/16/17.
 */
module.exports = function (app) {
    app.get("/api/sign-s3", signS3);

    function signS3(req, res) {
        var aws = require('aws-sdk');
        var s3 = new aws.S3();
        const S3_BUCKET = process.env.S3_BUCKET;

        const fileName = req.query.fileName;
        const fileType = req.query.fileType;
        const s3Params = {
            Bucket: S3_BUCKET,
            Key: fileName,
            Expires: 60,
            ContentType: fileType,
            ACL: 'public-read'
        };
        s3.getSignedUrl('putObject', s3Params, function(err, data) {
            if(err){
                console.log(err);
                return res.end();
            }
            const returnData = {
                signedRequest: data,
                url: "https://"+S3_BUCKET+".s3.amazonaws.com/"+fileName
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });
    }

}