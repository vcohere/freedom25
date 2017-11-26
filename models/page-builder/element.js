const mongoose = require('mongoose'),
			Promise = require('promise')

const Schema = mongoose.Schema

/*
 * Schema and model for MongoDB
 */

const ElementSchema = new Schema({
	name: String,
	text: {
		name: {type: String, default: 'Texte'},
		value: String,
		input: {type: String, default: 'text'}
	},
	color: {
		name: {type: String, default: 'Couleur'},
		value: String,
		input: {type: String, default: 'text'}
	}
})

const ElementModel = mongoose.model('Element', ElementSchema)

/*
 * Actual Element object definition
 */

class Element {
	constructor(name, text, color) {
		this.id = undefined
		this.name = name
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
			let res = new ElementModel({
				name: this.name,
				text: {
					value: this.text
				},
				color: {
					value: this.color
				}
			})

			res.save((err, data) => {
				if (err) reject(err)

				this.id = data.id
				resolve(data.id)
			})
		})
	}

	static updateElements(elements) {
		return new Promise((resolve, reject) => {
			for (var i = 0; i < elements.length; i++) {
				ElementModel.findOneAndUpdate({_id: elements[i]._id}, elements[i], (err, docs) => {
					if (err) reject(err)

					resolve(docs)
				})
			}
		})
	}
}

module.exports = Element
