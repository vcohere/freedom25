require("babel-core").transform("code")

const http = require('http'),
		fs = require('fs'),
    express = require('express'),
		pug = require('pug'),
    serveStatic = require('serve-static'),
		bodyParser = require('body-parser'),
		loki = require('lokijs'),
		multer = require('multer'),
		morgan = require('morgan'),
		Promise = require('promise')

const port = 8080,
		app = express()

var storageMulter = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './img'); // set the destination
    },
    filename: function(req, file, callback){
        callback(null, Date.now() + '.jpg'); // set the file name and extension
    }
})


const upload = multer({
	storage: storageMulter
})

var storage = null


app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/pages', serveStatic(__dirname + '/pages'))
app.use('/navs', serveStatic(__dirname + '/navs'))
app.use('/lib', serveStatic(__dirname + '/lib'))
app.use('/img', serveStatic(__dirname + '/img'))
app.use('/js', serveStatic(__dirname + '/js'))

app.all('/*', morgan('tiny'))

app.get('/', (req, res) => {
  res.render(__dirname + '/index.pug', {
		ge: getElement,
		gp: getPages,
		gf: getFolder,
		isInPages: isInPages,
		multi: true
	})
})

app.get('/admin', (req, res) => {
	res.render(__dirname + '/pages/admin/admin.pug', {data: storage, removeSpaces: removeSpaces})
})

app.post('/updateContent', upload.any(), (req, res) => {
	storage = req.body.data

	writeData().then((data) => {
		res.sendStatus(200)
		getData()
	})

	/*
	treatUploads(req.files).then(() => {
		console.log(storage)

	})*/
})

http.createServer(app).listen(port)

const removeSpaces = (str) => {
	return str.replace(/\s/g, '')
}

const getFolder = (name) => {
	for (var i in storage) {
		if (name === i)
			return storage[i].data.folder
	}

	return null
}

const getPages = () => {
	let res = []

	for (var i in storage) {
		if (i !== 'Navigation')
			res.push(i)
	}

	return res
}

const isInPages = (page) => {
	for (var i in storage) {
		if (page === i)
			return true;
	}

	return false;
}

const getElement = (name) => {
	let split = name.split('.')
	let tmp = storage[split[0]][split[1]]
	if (!tmp)
		return 'element not found in db'

	for (var i = 0; i < tmp.length; i++) {
		if (tmp[i].name === split[2])
			return tmp[i].value
	}

	return 'not found'
}

const treatUploads = (files) => {
	return new Promise((resolve, reject) => {
		let count = 0;

		for (var i = 0; i < files.length; i++) {
			let tmp = files[i].fieldname.split('-'),
					ext = files[i].originalname.split('.').slice(-1)[0]
			let path = files[i].destination + '/' + tmp[0] + '/' + tmp[1] + '.' + ext

			fs.rename(files[i].path, path, (err) => {
				if (err)
					reject(err)

				storage[tmp[0]][tmp[1]] = path
				count++
				if (count === files.length)
					resolve(true)
			})
		}
	})
}

const writeData = () => {
	return new Promise((resolve, reject) => {
		let res = JSON.stringify(storage)

		fs.writeFile('./db/data.json', res, (err) => {
			if (err)
				reject(err)
			else {
				console.log('DB: Data written.')
				resolve('OK')
			}
		})
	})
}

const readData = () => {
	return new Promise((resolve, reject) => {
		fs.readFile('./db/data.json', 'utf-8', (err, data) => {
			if (err)
				reject(err)
			else
				resolve(JSON.parse(data))
		})
	})
}

const getData = () => {
	readData().then((res) => {
		storage = res
		console.log('DB: Data is ready.')
	})
}

fs.watch('./db/data.json', () => { getData() })

getData()
console.log('WEB: Started at http://localhost:8080/')
