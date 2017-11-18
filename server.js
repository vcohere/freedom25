require("babel-core").transform("code")

const http = require('http'),
		fs = require('fs'),
    express = require('express'),
		pug = require('pug'),
    serveStatic = require('serve-static'),
		bodyParser = require('body-parser'),
		loki = require('lokijs'),
		multer = require('multer'),
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

app.get('/', (req, res) => {
  res.render(__dirname + '/index.pug', storage)
})

app.get('/admin', (req, res) => {
	res.render(__dirname + '/pages/admin/admin.pug', {data: storage})
})

app.post('/updateContent', upload.any(), (req, res) => {
	storage = req.body.data

	treatUploads(req.files).then(() => {
		console.log(storage)

		/*
		writeData().then((data) => {
			res.sendStatus(200)
			getData()
		})*/
	})
})

http.createServer(app).listen(port)

const treatUploads = (files) => {
	return new Promise((resolve, reject) => {
		var count = 0;

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
		console.log('\n\n\n\n')
		console.log(res)
		console.log('DB: Data is ready.')
	})
}

fs.watch('./db/data.json', () => { getData() })

getData()
console.log('WEB: Started at http://localhost:8080/')
