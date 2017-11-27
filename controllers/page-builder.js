var Promise = require('promise'),
		mongoose = require('mongoose')

const Element = require('../models/page-builder/element')
const Page = require('../models/page-builder/page')

mongoose.connect('mongodb://mongo:27017')

var db = mongoose.connection

db.on('error', () => {
	console.log('MongoDB fatal error.')
})

var pageBuilder = () => {
	var title = new Element('Titre', 'Lorem ipsum dolor sit amet.', '#000000')
	var subtitle = new Element('Sous-titre', 'Lorem ipsum, dolor sit amet ? Lorem ipsum dolor sit amet.', '#424242')

	title.save().then(() => {
		return subtitle.save()
	}).then(() => {
		page = new Page('landing', 'pages/landing', [title.get().id, subtitle.get().id])

		return page.save()
	}).then(() => {
		console.log('success')
	}).catch((err) => {
		console.log(err)
	})
}

module.exports = {
	build: pageBuilder,
	Page: Page,
	Element: Element
}
