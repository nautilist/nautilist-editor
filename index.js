var css = require('sheetify')
var choo = require('choo')
css('tachyons')

// css styles
require('./views/style')

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
} else {
  app.use(require('choo-service-worker')())
}

// Stores
app.use(require('./stores/api')) // make sure this is first to read in feathersClient from helpers
app.use(require('./stores/workspace'))
app.use(require('./stores/public'))
app.use(require('./stores/user'))

// Routes & Views
app.route('/', require('./views/home'))
// app.route('/', require('./views/editor'))
app.route('/signup', require('./views/signup'))
// login routes
app.route('/login', require('./views/login'))
app.route('/reset', require('./views/LoginReset'))
app.route('/verify', require('./views/verify'))

app.route('/projects', require('./views/projects'))
app.route('/projects/:id', require('./views/project'))

app.route('/collections', require('./views/collections'))
app.route('/collections/:id', require('./views/collection'))

app.route('/users', require('./views/users'))
app.route('/users/:username', require('./views/user'))

app.route('/test', require('./views/test'))
app.route('/about', require('./views/about'))
app.route('/browse', require('./views/browse'))

app.route('/*', require('./views/404'))

if (typeof window !== 'undefined') {
  document.body.appendChild(app.start())
  app.mount('body')
}

app.use((state, emitter) => {                  // 1.
  emitter.on('navigate', () => {               // 2.
    console.log(`Navigated to ${state.route}`) // 3.

    switch(state.route){
      // projects
      case '':
        emitter.emit("fetch-home", {});
        break;
      case 'projects':
        emitter.emit("fetch-projects", {});
        break;
      case 'about':
        // emitter.emit("fetch-projects", {});
        break;
      case 'browse':
        // emitter.emit("fetch-projects", {});
        break;
      case 'projects/:id':
        if(state.params.hasOwnProperty('id')){
          emitter.emit("fetch-project", state.params.id);
        }
        break;
      // collections
      case 'collections':
        emitter.emit("fetch-collections", {});
        break;
      case 'collections/:id':
        if(state.params.hasOwnProperty('id')){
          emitter.emit("fetch-collection", state.params.id);
        }
        break;
      // users
      case 'users':
        emitter.emit("fetch-users", {});
        break;
      case 'users/:username':
        if(state.params.hasOwnProperty('username')){
          emitter.emit('fetch-user', state.params.username);
        }
        break;
      // default
      default:
        break;
    }    

  })
})

module.exports = app;

// if (typeof window !== 'undefined' && window.history.scrollRestoration) {
//   window.history.scrollRestoration = 'manual'
// }

// module.exports = app.mount('body')
