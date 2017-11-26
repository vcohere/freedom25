var Promise = require('promise'),
		mongoose = require('mongoose')

const Element = require('../models/page-builder/element')
const Block = require('../models/page-builder/block')
const Page = require('../models/page-builder/page')

mongoose.connect('mongodb://mongo:27017')

var db = mongoose.connection

db.on('error', () => {
	console.log('MongoDB fatal error.')
})

var pageBuilder = () => {
	var p = new Element('Paragraphe', 'plop', 'pink')

	p.save().then(() => {
		block = new Block([p.get().id])

		return block.save()
	}).then(() => {
		page = new Page('landing', [block.get().id])

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
	Block: Block,
	Element: Element
}
