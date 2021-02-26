const recognition = require('../recognition')
const search = require('../search')
const storage = require('../storage')
const nameThatColor = require('../color_theory').nameThatColor

nameThatColor.ntc.init()
//store in s3 
//process celebs 
//get prominate colors 
//build search terms 
//return list of product urls 

const processVibeCheck = async function (request, requestId){
    await storage.publishToS3(request.uri, requestId+findExtention(request.uri))
    const findCelebritiesResult = await recognition.findCelebrities({
        bucket: "src-lambda-image-resources",  
        name: requestId+findExtention(request.uri)
    })
    const findDominateColorsResult = await recognition.findDominateColors(`https://src-lambda-image-resources.s3-us-west-2.amazonaws.com/${requestId+findextention(request.uri)}`)
    const searchTerms = buildSearchTerms(findCelebritiesResult, findDominateColorsResult)
    const searchResults = await search.snkrSearch(searchTerms)
    return formatResults(searchResults);
}

const findExtention = (uri) => {    
    return '.' + uri.split('.').pop()
}

const formatResults = (results) => {
    if(results.totalResources == 0){
        return []
    } else return results.objects.map(product => product.url)
}

const buildSearchTerms = (findCelebritiesResult, findDominateColorsResult) => {
    const colors = findDominateColorsResult.map(colorResult => getColorName(colorResult.color))
    if(colors.length > 3) colors.slice(0,2)
    const celebrities = findCelebritiesResult
}

const getColorName = (rgb) => {
    const rgbHex = require('rgb-hex');
    const hex = rgbHex(rgb.red, rgb.green, rgb.blue)
    return nameThatColor.ntc.name(`#${hex}`)
}
console.log(getColorName({ red: 120, green: 100, blue: 150}))
console.log(processVibeCheck({uri: 'https://src-lambda-image-resources.s3-us-west-2.amazonaws.com/test.png', requestId: "06e4c8a3-c2c6-45c5-b37a-138fe710c492"}))

const nikeCelebs = [
    "Mike Trout",
    "Rory McIlroy",
    "Kylian Mbappe",
    "Odell Beckham Jr.",
    "Blake Griffen",
    "Russell Wilson",
    "Russell Westbrook",
    "Tiger Woods",
    "Chris Paul",
    "Carmelo Anthony",
    "Rafael Nadal",
    "Kevin Durant",
    "LeBron James",
    "Neymar",
    "Cristiano Ronaldo",
]

exports.processVibeCheck = processVibeCheck