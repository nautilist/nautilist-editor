const UserCollectionCard = require('./UserCollectionCard');

module.exports = function(collections){
    return collections.map(collection => {
      return UserCollectionCard(collection);
    })
}