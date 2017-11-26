const mongoose = require('mongoose')

const Schema = mongoose.Schema

/*
 * Schema and model for MongoDB
 */

const PageSchema = new Schema({
  name: String,
 	blocks: [
 		{type: Schema.Types.ObjectId, ref: 'Block'}
	]
})

const PageModel = mongoose.model('Page', PageSchema)

/*
 * Actual Textblock object definition
 */

class Page {
	constructor(name, blocks) {
    this.name = name
		this.blocks = blocks
	}

	get() {
		// Getter, return "this" content
		return this
	}

	save() {
		// Save "this" in MongoDB collection and return the ID
		return new Promise((resolve, reject) => {
			let res = new PageModel({name: this.name, blocks: this.blocks})

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
        path: 'blocks',
        model: 'Block',
        populate: {
          path: 'elements',
          model: 'Element'
        }
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
}

module.exports = Page
