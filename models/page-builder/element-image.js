const mongoose = require('mongoose'),
			Promise = require('promise')

const Schema = mongoose.Schema

/*
 * Schema and model for MongoDB
 */

const ElementImageSchema = new Schema({
	path: String,
	width: String
})

const ElementImageModel = mongoose.model('ElementImage', ElementImageSchema)

/*
 * Actual ElementImage object definition
 */

class ElementImage {
	constructor(path, width) {
		this.path = path
		this.width = width
	}

	get() {
		// Getter, return "this" content
		return this
	}

	save() {
		// Save "this" in MongoDB collection and return the ID
		return new Promise((resolve, reject) => {
			let res = new ElementImageModel({path: this.path, width: this.width})

			res.save((err, data) => {
				if (err) reject(err)

				resolve(data.id)
			})
		})
	}
}

module.exports = ElementImage
