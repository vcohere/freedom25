var http = require('http'),
    express = require('express'),
    serveStatic = require('serve-static'),
		csv = require('fast-csv')

var port = 8080

var app = express()

app.use('/static', serveStatic(__dirname + '/src/static'))

app.get('/*', function(req, res) {
  res.sendFile('/app/index.html', {root: __dirname})
})

http.createServer(app).listen(port)

console.log('Started\nhttp://localhost:8080/')
