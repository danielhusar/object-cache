'use strict';

var fs = require('fs');
var extend = require('node.extend');
var q = require('q');

exports.cache = function(params, callback) {
  var defaults = {
    folder: './cache',
    async: false,
    encoding: 'utf8'
  };
  this.options = extend(defaults, params);

  //Create cache directory
  if(this.options.async) {
    fs.exists(this.options.folder, function(exist){
      if(!exist) {
        fs.mkdir(this.options.folder, function(err){
          if(callback) {
            callback(err);
          }
        });
      }
    }.bind(this));
  } else {
    if(!fs.existsSync(this.options.folder)){
      fs.mkdir(this.options.folder, function(){});
    }
  }
};

/**
 * Get cache from disk
 * @param  {string}   filename of the cache
 * @param  {Function} callback function (optional) - just for the async
 * @return {promise/object/false} - return promise for async calls, object/false for sync calls
 */
exports.cache.prototype.get = function(filename, callback) {
  var file = this.options.folder + '/' + filename;

  if(this.options.async) {
    var deferred = q.defer();
    fs.exists(file, function(exist){
      if(exist) {
        fs.readFile(file, function (err, data) {
          if(data) {
            data = JSON.parse(data);
          }
          if(callback) {
            callback({error: err}, data);
          }
          if(err) {
            deferred.reject({error: err});
          } else {
            deferred.resolve(data);
          }
        });
      } else {
        if(callback){
          callback({error: 'Filename doesnt exits'}, null);
        }
        deferred.reject({error: 'Filename doesnt exits'});
      }
    });
    return deferred.promise;
  } else {
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, this.options.encoding )) : false;
  }
};


/**
 * Store cache on disk
 * @param  {string}   filename of file to store
 * @param  {object}   data     data to store
 * @param  {Function} callback callback function (optional) - just for the async
 * @return {promise/object} - return promise for async calls, fs output for sync calls
 */
exports.cache.prototype.store = function(filename, data, callback) {
  if(typeof data === 'object'){
    data = JSON.stringify(data);
  }
  var file = this.options.folder + '/' + filename;

  if(this.options.async) {
    var deferred = q.defer();
    fs.writeFile(file, data, {encoding: this.options.encoding}, function(err){
      if (err) {
        if(callback) {
          callback(err, null);
        }
        deferred.reject({error: err});
      } else{
        if(callback) {
          callback(null, true);
        }
        deferred.resolve();
      }
    });
    return deferred.promise;
  } else {
    return fs.writeFileSync(file, data, {encoding: this.options.encoding});
  }
};

/**
 * Remove cache form disk
 * @param  {string}   filename to remove
 * @param  {Function} callback Callback to call when file si removed, just for async
 * @return {promise/object} return promise for async calls, fs output for sync calls
 */
exports.cache.prototype.remove = function(filename, callback) {
  var file = this.options.folder + '/' + filename;

  if(this.options.async) {
    var deferred = q.defer();
    fs.exists(file, function(exist){
      if(exist) {
        fs.unlink(file, function (err) {
          if (err) {
            if(callback) {
              callback(err, null);
            }
            deferred.reject({error: err});
          } else{
            if(callback) {
              callback(null, true);
            }
            deferred.resolve();
          }
        });
      } else {
        if(callback) {
          callback(null, true);
        }
        deferred.resolve();
      }
    });
    return deferred.promise;
  } else {
    return fs.unlinkSync(file);
  }
};
