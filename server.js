require("babel-core").transform("code")

const http = require('http'),
		fs = require('fs'),
    express = require('express'),
		pug = require('pug'),
    serveStatic = require('serve-static'),
		csv = require('fast-csv'),
		Promise = require('promise')

const port = 8080,
		app = express()

var storage = null


app.set('view engine', 'pug')
app.use('/pages', serveStatic(__dirname + '/pages'))

app.get('/', (req, res) => {
  res.render(__dirname + '/index.pug', {data: storage})
})

app.get('/admin', (req, res) => {
	res.render(__dirname + '/admin.pug', storage)
})

http.createServer(app).listen(port)

const writeData = (name, content) => {
	//
	let res = ''
	storage[name] = content

	for (let key in storage) {
		res += key + ':' + storage[key] + '\n'
	}

	fs.writeFileSync('./data.csv', res)
}

const readData = new Promise((resolve, reject) => {
	let res = {}

	csv.fromPath("./data.csv")
	.on('data', (data) => {
		let tmp = data[0].split(':'),
	 			obj = {}

		res[tmp[0]] = tmp[1]
	})
	.on('end', (data) => { resolve(res) })
})

const getData = () => {
	console.log('yo')
	readData.then((res) => {
		console.log('Data is ready.')
		storage = res
	})
}

fs.watch('data.csv', () => { getData() })

getData()
console.log('Started\nhttp://localhost:8080/')
