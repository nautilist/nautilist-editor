const html = require('choo/html');
const UserCard = require('./UserCard');

module.exports = function(users){
    return users.map(user => {
        return UserCard(user);
    })
}
