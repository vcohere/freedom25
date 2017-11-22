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
		mkdirp = require('mkdirp'),
		Promise = require('promise'),
		getter = require('./getter.js')

const port = 8000,
		app = express()

var storageMulter = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './static/img'); // set the destination
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
app.use('/static', serveStatic(__dirname + '/static'))

app.all('/*', morgan('tiny'))

app.get('/', (req, res) => {
  res.render(__dirname + '/index.pug', {
		ge: getElement,
		gp: getPages,
		gf: getFolder,
		isInPages: isInPages,
		multi: isMultiPage()
	})
})

app.get('/admin', (req, res) => {
	res.render(__dirname + '/pages/admin/admin.pug', {data: storage, removeSpaces: removeSpaces, gf: getFolder})
})

app.post('/updateContent', (req, res) => {
	storage = req.body.data

	writeData().then(() => {
		res.sendStatus(200)
		getData()
	}).catch((err) => {
		console.log(err)
	})
})

app.post('/uploadPhoto', upload.any(), (req, res) => {
	treatUploads(req.files, req.body).then(() => {
		writeData().then(() => {
			res.sendStatus(200)
			getData()
		})
	}).catch((err) => {
		console.log(err)
	})
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

const isMultiPage = () => {
	if (getElement('Navigation.Type de site.Choix') === 'multi')
		return true
	else
		return false
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

const treatUploads = (files, data) => {
	// Code à refactoriser !!!! C'est l'horreur
	return new Promise((resolve, reject) => {
		let ext = files[0].originalname.split('.').slice(-1)[0],
				name = files[0].filename.split('.')[0],
				keys = data.key.split('.')
		let path = files[0].destination + '/' + data.path + '/',
				filename = name + '.' + ext

		mkdirp(path, (err) => {
			if (err) {
				reject(err)
				return false;
			}

			fs.rename(files[0].path, path + filename, (err) => {
				if (err) {
					reject(err)
					return false;
				}

				for (var i = 0; i < storage[keys[0]][keys[1]].length; i++) {
					if (storage[keys[0]][keys[1]][i].name === keys[2]) {
						let s = i

						fs.unlink(storage[keys[0]][keys[1]][s].value, (err) => {
							storage[keys[0]][keys[1]][s].value = path + filename
							resolve(true)
						})
						break;
					}
				}
			})
		})
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
console.log('WEB: Started at http://localhost:'+port+'/')
