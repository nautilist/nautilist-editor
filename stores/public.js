const feathersClient = require('../helpers/feathersClient')

module.exports = store

store.storeName = 'public'
function store (state, emitter) {
  state.projects = [];
  state.selectedProject = {};
  state.users = [];
  state.selectedUser = {};
  state.selectedUserProjects = [];

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

  emitter.on('fetch-users', () => {
    feathersClient.service('/users').find({}).then(result => {
      state.users = result.data
      emitter.emit('render');
    }).catch(err => {
      console.log(err, "could not find project")
    })
  })

  emitter.on('fetch-user', (username) => {
    
    feathersClient.service('/users').find({username: username}).then(result => {
      state.selectedUser = result.data[0]

      const queryParams = {
        query:{
            owner: state.selectedUser._id
        }
      }

      return feathersClient.service('/api/projects').find(queryParams)
    }).then(result => {
      state.selectedUserProjects = result.data;
      emitter.emit('render');
    })
    .catch(err => {
      console.log(err, "could not find user")
    })
  })


  emitter.on('DOMContentLoaded', function () {})
}