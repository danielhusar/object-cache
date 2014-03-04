# Object cache

> Store and return object from cache

## Install

Download [manually](https://github.com/danielhusar/object-cache) or with a package-manager.

#### [npm](https://npmjs.org/package/is-html)

```
npm install --save object-cache
```



## Example

#### Node.js

```
var cache = new Cache(params);
```

params:

```
{
    folder: './cache',
    async: false,
    encoding: 'utf8'
}
```


#### Usage

Sync:

```
var cache = new Cache();
var sampleObj = {
  	prop: 'val'
};
cacheSync.store('sampleObj.json', sampleObj);
cacheSync.remove('sampleObj.json');

```

Async with callback:

```
var cache = new Cache({
  async: true
});

var sampleObj = {
  	prop: 'val'
};

cache('sampleObj.json', sampleObj, function(){
	cache('sampleObj.json', function(error, data){
    	console.log(data);
	});
});

cache.remove('sampleObj.json', function(err, success){
	console.log(err, success);
});

```

Async with promises:

```
var cache = new Cache({
  async: true
});

var sampleObj = {
  	prop: 'val'
};

cache.store('sampleObj2.json', sampleObj2).then(function(){
	cache.get('sampleObj2.json').then(function(data){
    	console.log(data);
	});
});

cache.remove('sampleObj2.json').then(function(){
  console.log('done');
});
```


## License

MIT ©
