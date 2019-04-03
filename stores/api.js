const feathersClient = require('../helpers/feathersClient');

module.exports = store

store.storeName = 'api'
function store(state, emitter) {
    state.api = {
        projects: feathersClient.service('/api/projects'),
        links: feathersClient.service('/api/links'),
        lists: feathersClient.service('/api/lists'),
        tracks: feathersClient.service('/api/tracks'),
        collections: feathersClient.service('/api/collections'),
        users: feathersClient.service('users'),
        authmanagement: feathersClient.service('authmanagement'),
        authenticate: function(payload){
            if(payload !== undefined){
                return feathersClient.authenticate(payload)
            }
            return feathersClient.authenticate()
            
        },
        logout: function(){
            return feathersClient.logout()
        }
    }
}