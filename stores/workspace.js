const yaml = require('js-yaml');
const slugify = require('slugify');
const shortid = require('shortid');
const helpers = require('../helpers');
const md2jt = require('../helpers/md2jt');

module.exports = store
store.storeName = 'workspace'

function store (state, emitter) {
  
  state.workspace = {

  }

  // emitter.on('DOMContentLoaded', () => {
    
    emitter.on('remix', (payload) => {
      const {id, db} = payload;
  
      state.api[db].get(id)
        .then(result => {
          let sanitizedResult = helpers.removeIds(result);
          return state.api[db].create(sanitizedResult)
        })
        .then(result => {
          // navigate to the route
          alert('feature copied!')
          // emitter.emit('pushState', `/${db}/${result._id}`);
          // emitter.emit('render');
        })
        .catch(err => {
          alert(err);
        })
  
    });
  
    emitter.on('patch-list', (payload) => {
      // const {}
      // state.api.lists.patch()
  
    })

  // }) // end DOMContentLoaded
  


} // end store

