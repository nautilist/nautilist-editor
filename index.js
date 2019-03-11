var css = require('sheetify')
var choo = require('choo')
const config = require('./config.js');

css('tachyons')

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
app.route('/login', require('./views/login'))
app.route('/public', require('./views/public'))
app.route('/projects/:id', require('./views/project'))

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
    // emitter.emit('render');
    if(state.route == 'public'){
      emitter.emit("fetch-projects", {});
    }

  })
})

module.exports = app;

// if (typeof window !== 'undefined' && window.history.scrollRestoration) {
//   window.history.scrollRestoration = 'manual'
// }

// module.exports = app.mount('body')
