var http = require('http'),
		fs = require('fs'),
    express = require('express'),
		pug = require('pug'),
    serveStatic = require('serve-static'),
		csv = require('fast-csv'),
		Promise = require('promise')

var port = 8080,
		storage = null

var app = express()

app.set('view engine', 'pug')
app.use('/pages', serveStatic(__dirname + '/pages'))

app.get('/', function(req, res) {
  res.render(__dirname + '/index.pug')
})

http.createServer(app).listen(port)

var writeData = function(name, content) {
	//
	var res = ''
	storage[name] = content

	for (var key in storage) {
		res += key + ':' + storage[key] + '\n'
	}

	fs.writeFileSync('./data.csv', res)
}

var readData = new Promise(function(resolve, reject) {
	var res = {}

	csv.fromPath("./data.csv")
	.on('data', function(data) {
		var tmp = data[0].split(':')
		var obj = {}
		res[tmp[0]] = tmp[1]
	})
	.on('end', function(data) {
		resolve(res)
	})
})

var getData = function() {
	readData.then(function(res) {
		storage = res
	})
}

console.log('Started\nhttp://localhost:8080/')
getData()
setTimeout(function() {
	writeData('data2', 'yay success !')
}, 1000)
