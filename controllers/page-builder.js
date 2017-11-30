var Promise = require('promise'),
		mongoose = require('mongoose')

const Page = require('../models/page-builder/page')
const Element = require('../models/page-builder/element')

const appDir = require('path').dirname(require.main.filename)

mongoose.connect('mongodb://mongo:27017')

var db = mongoose.connection

db.on('error', () => {
	console.log('MongoDB fatal error.')
})

const testGenerator = require('../pages/test/generator')

const transformPages = (pages) => {
  var res = {}

  for (var i = 0; i < pages.length; i++) {
    var tmp = pages[i].name

    res[tmp] = transformElements(pages[i].elements)
    res[tmp].active = pages[i].active
  }

  return res
}

const transformElements = (elements) => {
  let res = {}

  for (var i = 0; i < elements.length; i++) {
    let tmp = elements[i].name
    let tmmp = {}

    for (var j in elements[i]) {
      if (typeof elements[i][j] == 'object' && elements[i][j].value)
        tmmp[j] = elements[i][j].value
    }

    res[tmp] = tmmp
  }

  return res
}

const getActivesAndFull = () => {
	return new Promise((resolve, reject) => {
		var datas = [
			Page.getFull(),
			Page.getActives()
		]

		Promise.all(datas).then((ret) => {
			resolve(ret)
		}).catch((err) => {
			reject(err)
		})
	})
}

const getActivesAndTransformed = () => {
	return new Promise((resolve, reject) => {
		var datas = [
			Page.getFull(),
			Page.getActives()
		]

		Promise.all(datas).then((ret) => {
			ret[0] = transformPages(ret[0])
			resolve(ret)
		}).catch((err) => {
			reject(err)
		})
	})
}

module.exports = {
	transformPages: transformPages,
	getActives: Page.getActives,
	getFullData: Page.getFull,
	getActivesAndFull: getActivesAndFull,
	getActivesAndTransformed: getActivesAndTransformed
}
