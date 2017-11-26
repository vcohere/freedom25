const mongoose = require('mongoose'),
      Element = require('./element')

const Schema = mongoose.Schema

/*
 * Schema and model for MongoDB
 */

const BlockSchema = new Schema({
 	elements: [
 			{type: Schema.Types.ObjectId, ref: 'Element'}
	]
})

const BlockModel = mongoose.model('Block', BlockSchema)

/*
 * Actual TextElement object definition
 */

class Block {
	constructor(elements) {
		/*
		 * [kind: String, item: Element.id]
		 */

		this.elements = elements
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

        console.log(err)
				this.id = data.id
				resolve(data.id)
			})
		})
	}

  static updateElementsInBlocks(blocks) {
    return new Promise((resolve, reject) => {
      var arr = []

      for (var i = 0; i < blocks.length; i++) {
        arr.push(Element.updateElements(blocks[i].elements))
      }

      Promise.all(arr).then(() => {
        resolve(true)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}

module.exports = Block
