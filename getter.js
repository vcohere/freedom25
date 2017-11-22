module.exports = {
  getFolder = (name) => {
  	for (var i in storage) {
  		if (name === i)
  			return storage[i].data.folder
  	}

  	return null
  },
  getPages = () => {
  	let res = []

  	for (var i in storage) {
  		if (i !== 'Navigation')
  			res.push(i)
  	}

  	return res
  },
  getElement = (name) => {
  	let split = name.split('.')
  	let tmp = storage[split[0]][split[1]]
  	if (!tmp)
  		return 'element not found in db'

  	for (var i = 0; i < tmp.length; i++) {
  		if (tmp[i].name === split[2])
  			return tmp[i].value
  	}

  	return 'not found'
  },
  getMultiPage = () => {
  	if (getElement('Navigation.Type de site.Choix') === 'multi')
  		return true
  	else
  		return false
  }
}
