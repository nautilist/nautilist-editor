const LinkCard = require('./LinkCard');

module.exports = function(links){
    return links.map(link =>{
      return LinkCard(link)
    })    
}