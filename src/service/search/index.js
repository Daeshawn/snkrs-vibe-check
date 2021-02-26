const request = require('request');

const search = async function (searchTerms) {
    return new Promise((resolve, reject) => {
        const searchQuery = searchTerms.join('%20');
        request.get(`https://api.nike.com/search/visual_searches/v1?marketplace=us&language=en&searchTerms=${searchQuery}`,
            function (error, response, body) {
                if (error) { reject(error) }
                else {
                    console.log(response.statusCode)
                    resolve(body)
                }
            })
    })
}

exports.snkrSearch = search