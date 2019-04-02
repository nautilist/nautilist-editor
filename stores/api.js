const feathersClient = require('../helpers/feathersClient');

module.exports = store

store.storeName = 'api'
function store(state, emitter) {
    state.api = {
        projects: feathersClient.service('/api/projects'),
        links: feathersClient.service('/api/links'),
        collections: feathersClient.service('/api/collections'),
        users: feathersClient.service('users'),
        authmanagement: feathersClient.service('authmanagement'),
        authenticate: function(payload){
            return feathersClient.authenticate(payload)
        },
        logout: feathersClient.logout()
    }
}