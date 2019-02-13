var css = require('sheetify')
var choo = require('choo')

css('tachyons')

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
} else {
  app.use(require('choo-service-worker')())
}

// app.use(require('./stores/clicks'))
app.use(require('./stores/workspace'))

app.route('/', require('./views/main'))
app.route('/*', require('./views/404'))

// if (typeof navigator !== 'undefined') {
//   console.log("not defined!!!!!")
//   document.body.appendChild(app.start())
  
// }

module.exports = app.mount('body')
