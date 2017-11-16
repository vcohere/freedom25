require("babel-core").transform("code")

const http = require('http'),
		fs = require('fs'),
    express = require('express'),
		pug = require('pug'),
    serveStatic = require('serve-static'),
		csv = require('fast-csv'),
		bodyParser = require('body-parser'),
		Promise = require('promise')

const port = 8080,
		app = express()

var storage = null


app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/pages', serveStatic(__dirname + '/pages'))
app.use('/navs', serveStatic(__dirname + '/navs'))
app.use('/lib', serveStatic(__dirname + '/lib'))

app.get('/', (req, res) => {
  res.render(__dirname + '/index.pug', storage)
})

app.get('/admin', (req, res) => {
	console.log(storage);
	res.render(__dirname + '/pages/admin/admin.pug', {data: storage, keys: Object.keys(storage)})
})

app.post('/updateContent', (req, res) => {
	storage = JSON.parse(req.body.data)
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


		fs.readFile('./data.csv', 'utf-8', (err, data) => {
			if (err)
				reject(err)

			data = data.split('\n')

			for (i = 0; i < data.length; i++) {
				if (data[i] === '')
					continue;
				let tmp = data[i].split(':'),
						words = tmp[0].split('_')

				if (!res[words[0]])
					res[words[0]] = {}

				res[words[0]][words[1]] = tmp[1]
			}

			resolve(res)
		})
})

const getData = () => {
	readData.then((res) => {
		storage = res
		console.log('Data is ready.')
	})
}

fs.watch('data.csv', () => { getData() })

getData()
console.log('Started\nhttp://localhost:8080/')
