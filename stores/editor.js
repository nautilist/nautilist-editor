const feathersClient = require('../helpers/feathersClient')

module.exports = store

store.storeName = 'editor'

function store(state, emitter) {

    state.editor = {
        currentTab: 'links'
    }
  

}