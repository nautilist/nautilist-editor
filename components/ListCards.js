const ListCard = require('./ListCard');

module.exports = function(lists){
    return lists.map(list =>{
      return ListCard(list)
    })    
}