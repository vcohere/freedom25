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
			let res = new PageModel({name: this.name, path: this.path, active: this.active, elements: this.elements})

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
    // Récupère les pages avec populate()
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
    // Récupère toutes les pages sans populate()
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

  static pageDontExists(name) {
    // Vérifie si une page existe avant de la créer en base
    return new Promise((resolve, reject) => {
      PageModel.count({name: name}, (err, count) => {
        if (count > 0)
          reject('Page exists')
        else
          resolve(true)
      })
    })
  }

  static getActives() {
    // Renvoie le nom des pages actives
    return new Promise((resolve, reject) => {
      PageModel.find({active: true}, (err, docs) => {
        if (err) reject(err)
        else {
          let res = {}

          for (var i in docs) {
            res[docs[i].name] = true
          }
          resolve(res)
        }
      })
    })
  }
}

module.exports = Page
