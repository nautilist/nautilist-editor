const UserFollowingProjectsCard = require('./UserFollowingProjectsCard');

module.exports = function(projects){
    return projects.map(proj => {
      return UserFollowingProjectsCard(proj);
    })
}