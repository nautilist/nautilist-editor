const UserProjectCard = require('./UserProjectCard');

module.exports = function(projects){
    return projects.map(proj => {
      return UserProjectCard(proj);
    })
}