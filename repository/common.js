const uuid = require("uuid");
const {uniqueNamesGenerator, adjectives, animals} = require("unique-names-generator")

function GenUniqueToken(){
    return uuid.v4()
}

function GenUsername(){
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals]
    }); 
}

module.exports = { GenUniqueToken, GenUsername }
