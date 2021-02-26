const recommendation = require('../service/recommendation')
exports.handler = async function (event, context) {
  recommendation.processVibeCheck(event, context.awsRequestId)
  .then(formatResponse)
}

var formatResponse = function (body) {
  var response = {
    "statusCode": 200,
    "headers": {
      "Content-Type": "application/json"
    },
    "isBase64Encoded": false,
    "body": body
  }
  return response
}