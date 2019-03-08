const feathersClient = require('../helpers/feathersClient')

module.exports = store

store.storeName = 'public'
function store (state, emitter) {
  state.projects = [];
  state.selectedProject = {};

  emitter.on('fetch-projects', () => {
    feathersClient.service('/api/projects').find({}).then(result => {
      state.projects = result.data
      emitter.emit('render');
    }).catch(err => {
      console.log("could not find projects")
    })
  })

  emitter.on('fetch-project', (id) => {
    console.log(id)
    feathersClient.service('/api/projects').get(id).then(result => {
      state.selectedProject = result
      emitter.emit('render');
    }).catch(err => {
      console.log(err, "could not find project")
    })
  })


  emitter.on('DOMContentLoaded', function () {})
}