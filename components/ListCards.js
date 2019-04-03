const ListCard = require('./ListCard');

module.exports = function(lists){
    return lists.map(lists =>{
      return ListCard(list)
    })    
}