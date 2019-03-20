var css = require('sheetify')
var choo = require('choo')
const config = require('./config.js');

css('tachyons')

console.log(process.env.NODE_ENV)

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
} else {
  
  // app.feathersRestApi = config.NAUTILISTAPI;
  // console.log(app.feathersRestApi)
  app.use(require('choo-service-worker')())
}

// app.use(require('./stores/clicks'))
app.use(require('./stores/workspace'))
app.use(require('./stores/public'))
app.use(require('./stores/user'))

app.route('/', require('./views/main'))
app.route('/signup', require('./views/signup'))
// login routes
app.route('/login', require('./views/login'))
app.route('/reset', require('./views/LoginReset'))
app.route('/verify', require('./views/verify'))

app.route('/public', require('./views/public'))
app.route('/projects/:id', require('./views/project'))
app.route('/users', require('./views/users'))
app.route('/users/:username', require('./views/user'))

app.route('/*', require('./views/404'))

// if (typeof navigator !== 'undefined') {
//   console.log("not defined!!!!!")
//   document.body.appendChild(app.start())
// }

if (typeof window !== 'undefined') {
  document.body.appendChild(app.start())
  app.mount('body')
}

app.use((state, emitter) => {                  // 1.
  emitter.on('navigate', () => {               // 2.
    console.log(`Navigated to ${state.route}`) // 3.

    switch(state.route){
      case 'public':
        emitter.emit("fetch-projects", {});
        break;
      case 'users':
        emitter.emit("fetch-users", {});
        break;
      case 'users/:username':
        if(state.params.hasOwnProperty('username')){
          emitter.emit('fetch-user', state.params.username);
        }
        break;
      case 'projects/:id':
        if(state.params.hasOwnProperty('id')){
          emitter.emit("fetch-project", state.params.id);
        }
        break;
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
