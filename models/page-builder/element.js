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

	static upsert(element) {
		return new Promise((resolve, reject) => {
			if (element._id) {
				ElementModel.findOneAndUpdate({_id: element._id}, element, {upsert: true, new: true}).exec().then((data) => {
					resolve(data)
				}).catch((err) => {
					reject(err)
				})
			}
			else {
				let res = new ElementModel(element)

				res.save().then((data) => {
					resolve(data)
				}).catch((err) => {
					reject(err)
				})
			}
		})
	}

	/*static update(elements) {
		return new Promise((resolve, reject) => {
			var arr = []

			for (var i = 0; i < elements.length; i++) {
				if (elements[i]._id) {
					arr.push(ElementModel.findOneAndUpdate({_id: elements[i]._id}, elements[i], {upsert: true, new: true}).exec())
				}
				else {
					let res = new ElementModel(elements[i])

					arr.push(res.save())
				}
			}

			Promise.all(arr).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	}*/
}

module.exports = Element
