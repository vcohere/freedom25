var storage = null,
		mkdirp = require('mkdirp'),
		Promise = require('promise'),
    fs = require('fs'),
		mongoose = require('mongoose')

mongoose.connect('mongodb://mongo:27017')

var db = mongoose.connection

db.on('error', () => {
	console.log('MongoDB fatal error.')
})

const ElementText = require('../models/page-builder/element-text')

const Block = require('../models/page-builder/block')

var newText = new ElementText({
	text: 'Salut',
	color: 'black'
})

var pageBuilder = () => {
	var p = new ElementText('plop', 'blue')

	p.save().then(() => {
		var b = new Block([{'kind': 'ElementText', 'item': p.get().id}])

		b.save().then(() => {
			console.log('wghart')
		})
	})
}

module.exports = {
	build: pageBuilder
}
