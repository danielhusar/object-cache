# Object cache [![Build Status](https://travis-ci.org/danielhusar/object-cache.svg)](https://travis-ci.org/danielhusar/object-cache)

> Store and return object from cache

## Install

Download [manually](https://github.com/danielhusar/object-cache) or with a package-manager.

#### [npm](https://npmjs.org/package/is-html)

```bash
npm install --save object-cache
```



## Example

#### Node.js

```javascript
var cache = new Cache(params);
```

params:

```javascript
{
		folder: './cache',
		async: false,
		encoding: 'utf8'
}
```


#### Usage

Sync:

```javascript
var cache = new Cache();
var sampleObj = {
		prop: 'val'
};
cache.store('sampleObj.json', sampleObj);
var file = cache.get('sampleObj.json');
cache.remove('sampleObj.json');

```

Async with callback:

```javascript
var cache = new Cache({
	async: true
});

var sampleObj = {
		prop: 'val'
};

cache.store('sampleObj.json', sampleObj, function(){
	cache.get('sampleObj.json', function(error, data){
			console.log(data);
	});
});

cache.remove('sampleObj.json', function(err, success){
	console.log(err, success);
});

```

Async with promises:

```javascript
var cache = new Cache({
	async: true
});

var sampleObj = {
		prop: 'val'
};

cache.store('sampleObj2.json', sampleObj2)
	.then(function(){
		return cache.get('sampleObj2.json');
	})
	.then(function(data){
		console.log(data);
	});

cache.remove('sampleObj2.json').then(function(){
	console.log('done');
});
```


## License

MIT ©
