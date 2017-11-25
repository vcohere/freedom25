const mongoose = require('mongoose'),
			Promise = require('promise')

const Schema = mongoose.Schema

/*
 * Schema and model for MongoDB
 */

const ElementTextSchema = new Schema({
	text: String,
	color: String
})

const ElementTextModel = mongoose.model('ElementText', ElementTextSchema)

/*
 * Actual TextElement object definition
 */

class ElementText {
	constructor(text, color) {
		this.id = undefined
		this.text = text
		this.color = color
	}

	get() {
		// Getter, return "this" content
		return this
	}

	save() {
		// Save "this" in MongoDB collection and return the ID
		return new Promise((resolve, reject) => {
			let res = new ElementTextModel({text: this.text, color: this.color})

			res.save((err, data) => {
				if (err) reject(err)

				this.id = data.id
				resolve(data.id)
			})
		})
	}
}

module.exports = ElementText
