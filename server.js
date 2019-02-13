var bankai = require('bankai/http')
var http = require('http')
var path = require('path')
const port =  process.env.PORT || 8080;

var compiler = bankai(path.join(__dirname, 'index.js'))

var server = http.createServer(function (req, res) {
  compiler(req, res, function () {
    res.statusCode = 404;
    res.end('not found')
  })
})

server.listen(port, function () {
  console.log('App running - see the magic at http://localhost:8080')
})