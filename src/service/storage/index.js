const AWS = require('aws-sdk')
const stream = require('stream');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const request = require('request');

const publishToS3 = function (uri, key) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(uploadFromStream(s3, key));
    });
};
const uploadFromStream = function (s3, key) {
    var pass = new stream.PassThrough();
    var s3Params = {
        Bucket: "src-lambda-image-resources", Key: key, Body: pass
    }
    var params = s3Params;
    s3.upload(params, function (err, data) {
        console.log(err, data);
    });
}

exports.publishToS3 = publishToS3