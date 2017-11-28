const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Element = require('./element')

/*
 * Schema and model for MongoDB
 */

const PageSchema = new Schema({
  name: String,
  path: String,
  active: Boolean,
 	elements: [
 		{type: Schema.Types.ObjectId, ref: 'Element'}
	]
})

const PageModel = mongoose.model('Page', PageSchema)

/*
 * Actual Page object definition
 */

class Page {
	constructor(name, path, active, elements) {
    this.name = name
    this.path = path
		this.elements = elements
    this.active = active
	}

	get() {
		// Getter, return "this" content
		return this
	}

	save() {
		// Save "this" in MongoDB collection and return the ID
		return new Promise((resolve, reject) => {
			let res = new PageModel({name: this.name, path: this.path, elements: this.elements})

			res.save((err, data) => {
				if (err) reject(err)

				/*PageModel.find().populate('blocks').exec((err, docs) => {
					for (var i = 0; i < docs.length; i++) {
						console.log(docs[i])
					}
				})*/

				this.id = data.id
				resolve(data.id)
			})
		})
	}

  static getFull() {
    return new Promise((resolve, reject) => {
      PageModel.find().populate({
        path: 'elements',
        model: 'Element'
      }).exec((err, docs) => {
        if (err) reject(err)

        resolve(docs)
      })
    })
  }

  static getPages() {
    return new Promise((resolve, reject) => {
      PageModel.find().exec((err, docs) => {
        if (err) reject(err)

        resolve(docs)
      })
    })
  }

  static update(page) {
		return new Promise((resolve, reject) => {
			var arr = []

			for (var i = 0; i < page.elements.length; i++) {
				arr.push(Element.upsert(page.elements[i]))
			}

			Promise.all(arr).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	}

  static toggleActive(id) {
    
  }
}

module.exports = Page
