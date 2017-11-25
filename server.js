require("babel-core").transform("code")

const http = require('http'),
		fs = require('fs'),
    express = require('express'),
		pug = require('pug'),
    serveStatic = require('serve-static'),
		bodyParser = require('body-parser'),
		multer = require('multer'),
		morgan = require('morgan'),
		Promise = require('promise'),
		mongoose = require('mongoose'),
		db = require('./controllers/db'),
		pageBuilder = require('./controllers/page-builder')

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

pageBuilder.build()

const upload = multer({
	storage: storageMulter
})

app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/pages', serveStatic(__dirname + '/pages'))
app.use('/navs', serveStatic(__dirname + '/navs'))
app.use('/static', serveStatic(__dirname + '/static'))

app.all('/*', morgan('tiny'))

app.get('/', (req, res) => {
  res.render(__dirname + '/index.pug', {
		ge: db.getElement,
		gp: db.getPages,
		gf: db.getFolder,
		isInPages: db.isInPages,
		multi: db.getMultiPage()
	})
})

app.get('/admin', (req, res) => {
	res.render(__dirname + '/pages/admin/admin.pug', {
		data: db.getStorage(),
		removeSpaces: removeSpaces,
		gf: db.getFolder,
		gp: db.getPages
	})
})

app.get('/admin2', (req, res) => {
	res.render(__dirname + '/pages/admin2/admin.pug', {
		data: db.getStorage(),
		removeSpaces: removeSpaces,
		gf: db.getFolder,
		gp: db.getPages
	})
})

app.post('/updateContent', (req, res) => {
	db.setStorage(req.body.data).then(() => {
		res.sendStatus(200)
	}).catch((err) => {
		console.log(err)
		res.sendStatus(418)
	})
})

app.post('/uploadPhoto', upload.any(), (req, res) => {
	db.storeUpload(req.files, req.body).then(() => {
		res.sendStatus(200)
	}).catch((err) => {
		console.log(err)
		res.sendStatus(418)
	})
})

http.createServer(app).listen(port)

db.getData()

console.log('WEB: Started at http://localhost:'+port+'/')

const removeSpaces = (str) => {
	return str.replace(/\s/g, '')
}
