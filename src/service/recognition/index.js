const AWS = require('aws-sdk')
const rekognition = new AWS.Rekognition({ apiVersion: '2016-06-27' });
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

const findCelebrities = async function (s3bucketObjectConfig) {
    return new Promise((res, err) => {
        var params = {
            Image: {
                S3Object: {
                    Bucket: s3bucketObjectConfig.bucket,
                    Name: s3bucketObjectConfig.name,
                }
            }
        };

        rekognition.recognizeCelebrities(params, function (error, data) {
            if (error) err(error) // an error occurred
            else res(data)
        })
    })
}

const findDominateColors = async function (uri) {
    const [result] = await client.imageProperties(
        uri
    );
    const colors = result.imagePropertiesAnnotation.dominantColors.colors;
    return colors;
}

findDominateColors('https://src-lambda-image-resources.s3-us-west-2.amazonaws.com/test.png')


exports.findCelebrities = findCelebrities
exports.findDominateColors = findDominateColors