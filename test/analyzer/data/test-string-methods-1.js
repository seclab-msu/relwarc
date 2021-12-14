H = {
	name: 'Bobik',
	type: 'dog',
	param: '&name'

}

axios.get('http://bestpetshop.com/search?pet='.concat(H.type).concat(H.param.concat('='))['con'.concat('cat')](H.name))
