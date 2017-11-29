var Promise = require('promise')

const Page = require('../../models/page-builder/page')
const Element = require('../../models/page-builder/element')

var generator = (isActive) => {
  return new Promise((resolve, reject) => {
    let name = 'test',
        path = '/pages/test'

    var title = new Element('Titre', 'Lorem ipsum dolor sit amet.', '#000000')
    var subtitle = new Element('Sous-titre', 'Lorem ipsum, dolor sit amet ? Lorem ipsum dolor sit amet.', '#424242')

    Page.pageDontExists(name).then(() => {
      // Check if the page exists, if not save the title
      return title.save()
    }).then(() => {
      // Then the subtitle
      return subtitle.save()
    }).then(() => {
      // Then save the page with the elements
      page = new Page('test', '/pages/test', isActive, [title.get().id, subtitle.get().id])

      return page.save()
    }).then(() => {
      resolve(true)
    }).catch((err) => {
      reject(err)
    })
  })
}

module.exports = {
	generator: generator
}
