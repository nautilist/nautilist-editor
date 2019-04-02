const feathersClient = require('../helpers/feathersClient')

module.exports = store

store.storeName = 'editor'

function store(state, emitter) {

    state.editor = {
        currentTab: 'links'
    }
  
    state.events.updateEditor = 'editor:update';

    emitter.on(state.events.updateEditor, function(){
        emitter.emit('render')
        emitter.emit('pushState', "/")
    })



}