var http = require('http'),
    express = require('express'),
    serveStatic = require('serve-static'),
		csv = require('fast-csv'),
		Promise = require('promise')

var port = 8080,
		storage = null

var app = express()

app.use('/static', serveStatic(__dirname + '/src/static'))

app.get('/*', function(req, res) {
  res.sendFile('/app/index.html', {root: __dirname})
})

http.createServer(app).listen(port)

var getDatas = new Promise(function(resolve, reject) {
	var res = new Array()

	csv.fromPath("./data.csv")
	.on('data', function(data) {
		var tmp = data[0].split(':')
		var obj = {}
		obj[tmp[0]] = tmp[1]

		res.push(obj)
	})
	.on('end', function(data) {
		resolve(res)
	})
})

getDatas.then(function(data) {
	storage = data
	//storeDatas();
	//console.log(storage)
})

console.log('Started\nhttp://localhost:8080/')
