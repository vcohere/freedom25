var Promise = require('promise')

const Page = require('../../models/page-builder/page')
const Element = require('../../models/page-builder/element')

var generator = (isActive) => {
	var title = new Element('Titre', 'Lorem ipsum dolor sit amet.', '#000000')
	var subtitle = new Element('Sous-titre', 'Lorem ipsum, dolor sit amet ? Lorem ipsum dolor sit amet.', '#424242')

	title.save().then(() => {
		return subtitle.save()
	}).then(() => {
		page = new Page('test', 'pages/test', isActive, [title.get().id, subtitle.get().id])

		return page.save()
	}).then(() => {
		console.log('success')
	}).catch((err) => {
		console.log(err)
	})
}

module.exports = {
	generator: generator
}
