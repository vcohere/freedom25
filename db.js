var storage = null,
		mkdirp = require('mkdirp'),
		Promise = require('promise'),
    fs = require('fs')

fs.watch('./db/data.json', () => { getData() })

const isInPages = (page) => {
	for (var i in storage) {
		if (page === i) {
      return true
    }
	}

	return false;
}

const setStorage = (data) => {
  storage = data
}

const getStorage = () => {
  return storage
}

const getFolder = (name) => {
	for (var i in storage) {
		if (name === i)
			return storage[i].data.folder
	}

	return null
}

const getPages = () => {
	let res = []

	for (var i in storage) {
		if (i !== 'Navigation')
			res.push(i)
	}

	return res
}

const getMultiPage = () => {
	if (getElement('Navigation.Type de site.Choix') === 'multi')
		return true
	else
		return false
}

const getElement = (name) => {
	let split = name.split('.')
	let tmp = storage[split[0]][split[1]]
	if (!tmp)
		return 'element not found in db'

	for (var i = 0; i < tmp.length; i++) {
		if (tmp[i].name === split[2])
			return tmp[i].value
	}

	return 'not found'
}

const storeUploads = (files, data) => {
	// Code à refactoriser !!!! C'est l'horreur
	return new Promise((resolve, reject) => {
		let ext = files[0].originalname.split('.').slice(-1)[0],
				name = files[0].filename.split('.')[0],
				keys = data.key.split('.')
		let path = files[0].destination + '/' + data.path + '/',
				filename = name + '.' + ext

		mkdirp(path, (err) => {
			if (err) {
				reject(err)
				return false;
			}

			fs.rename(files[0].path, path + filename, (err) => {
				if (err) {
					reject(err)
					return false;
				}

				for (var i = 0; i < storage[keys[0]][keys[1]].length; i++) {
					if (storage[keys[0]][keys[1]][i].name === keys[2]) {
						let s = i

						fs.unlink(storage[keys[0]][keys[1]][s].value, (err) => {
							storage[keys[0]][keys[1]][s].value = path + filename
							resolve(true)
						})
						break;
					}
				}
			})
		})
	})
}

const writeData = () => {
	return new Promise((resolve, reject) => {
		let res = JSON.stringify(storage)

		fs.writeFile('./db/data.json', res, (err) => {
			if (err)
				reject(err)
			else {
				console.log('DB: Data written.')
				resolve('OK')
			}
		})
	})
}

const readData = () => {
	return new Promise((resolve, reject) => {
		fs.readFile('./db/data.json', 'utf-8', (err, data) => {
			if (err)
				reject(err)
			else
				resolve(JSON.parse(data))
		})
	})
}

const getData = () => {
	readData().then((res) => {
		storage = res
		console.log('DB: Data is ready.')
	})
}


module.exports = {
  getFolder: getFolder,
  getPages: getPages,
  getElement: getElement,
  getMultiPage: getMultiPage,
  isInPages: isInPages,
  storeUploads: storeUploads,
  writeData: writeData,
  readData: readData,
  getData: getData,
  getStorage: getStorage,
  setStorage: setStorage
}
