const mongoose = require('mongoose')

const Schema = mongoose.Schema

/*
 * Schema and model for MongoDB
 */

const BlockSchema = new Schema({
 	elements: [{
 		element: {
 			kind: String,
 			item: {type: Schema.Types.ObjectId, refPath: 'elements.element.kind'}
 		}
	}]
})

const BlockModel = mongoose.model('Block', BlockSchema)

/*
 * Actual TextElement object definition
 */

class Block {
	constructor(elements) {
		/*
		 * [kind: String, item: Element]
		 */

		let tmp = []

		for (var i = 0; i < elements.length; i++)
			tmp.unshift({'element': elements[i]})

		this.elements = tmp
	}

	get() {
		// Getter, return "this" content
		return this
	}

	save() {
		// Save "this" in MongoDB collection and return the ID
		return new Promise((resolve, reject) => {
			let res = new BlockModel({elements: this.elements})

			res.save((err, data) => {
				if (err) reject(err)

				BlockModel.find().populate('elements.element.item').exec((err, docs) => {
					for (var i = 0; i < docs.length; i++) {
						console.log(docs[i].elements[0])
					}
				})

				this.id = data.id
				resolve(data.id)
			})
		})
	}
}

module.exports = Block
