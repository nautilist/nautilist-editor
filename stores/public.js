module.exports = store

store.storeName = 'public'

function store(state, emitter) {
  state.projects = [];
  state.selectedProject = {};

  state.links = [];
  state.selectedLink = {};

  state.collections = [];
  state.selectedCollection = {}
  
  state.users = [];
  state.selectedUser = {};

  state.selectedUserProjects = [];
  state.selectedUserFollowingProjects = [];
  state.selectedUserCollections = [];
  state.selectedUserFollowingCollections = []

  // state.events.saveProjectToLists = "saveProjectToLists";

  emitter.on('fetch-projects', () => {
    state.api.projects.find({}).then(result => {
      state.projects = result.data
      emitter.emit('render');
    }).catch(err => {
      console.log("could not find projects")
    })
  })

  emitter.on('fetch-collections', () => {
    state.api.collections.find({}).then(result => {
      state.collections = result.data
      emitter.emit('render');
    }).catch(err => {
      console.log("could not find collections")
    })
  })

  emitter.on('fetch-collection', (id) => {
    console.log(id)
    state.api.collections.get(id).then(result => {
      state.selectedCollection = result
      emitter.emit('render');
    }).catch(err => {
      console.log(err, "could not find collection")
    })
  })

  emitter.on('fetch-project', (id) => {
    console.log(id)
    state.api.projects.get(id).then(result => {
      state.selectedProject = result
      emitter.emit('render');
    }).catch(err => {
      console.log(err, "could not find project")
    })
  })

  emitter.on('fetch-users', () => {
    state.api.users.find({}).then(result => {
      state.users = result.data
      emitter.emit('render');
    }).catch(err => {
      console.log(err, "could not find project")
    })
  })

  emitter.on('fetch-user', (username) => {
    // TODO: add in search for collaborations
    const findByUsername = {
      query: {
        username
      }
    }

    state.api.users.find(findByUsername).then(result => {
        state.selectedUser = result.data[0]
        const queryParams = {
          query: {
            $or: [{
                owner: state.selectedUser._id
              },
              {
                "collaborators": {
                  "$in": state.selectedUser._id,
                }
              }
            ]
          }
        }
        return state.api.projects.find(queryParams)
      })
      .then(result => {
        const queryParams = {
          query: {
            owner: state.selectedUser._id
          }
        }
        state.selectedUserProjects = result.data;
        return state.api.collections.find(queryParams)
      })
      .then(result => {
        state.selectedUserCollections = result.data;

        const queryParams = {
          query: {
            "followers": {
              "$in": state.selectedUser._id
            }
          }
        }

        return state.api.collections.find(queryParams)
      })
      .then(result => {
        state.selectedUserFollowingCollections = result.data;

        const queryParams = {
          query: {
            "followers": {
              "$in": state.selectedUser._id
            }
          }
        }
        return state.api.projects.find(queryParams)
      })
      .then(result => {
        state.selectedUserFollowingProjects = result.data;
        emitter.emit('render');
      })
      .catch(err => {
        console.log(err, "could not find user")
      })
  })


  // emitter.on(state.events.saveProjectToLists, function(_payload){

  //   // TODO: check to see if user already has the project then throw err

  //   feathersClient.service("/api/projects").create()


  // })
}