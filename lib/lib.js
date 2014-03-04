'use strict';

var fs = require('fs');
var fsQ = require("q-io/fs");
var extend = require('node.extend');
var q = require('q');

exports.cache= function(params) {
  var defaults = {
    limit: false,
    folder: './cache',
    async: false,
    encoding: 'utf8'
  };
  this.options = extend(defaults, params);

  if(!fs.existsSync(this.options.folder)){
    fs.mkdir(this.options.folder, function(){
      console.log('Cache directory created: ' + this.options.folder);
    });
  }
};

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


/**
 * Helpers object
 */
var helpers = {

  /**
   * Base path for caching for our app
   * @type {string}
   */
  baseCachePath :  process.cwd() + '/cache/',

  /**
   * Returns the fullfile path
   * @param  {file} file - file name
   * @return {string} full file path
   */
  basePathFile : function(file){
    return (helpers.baseCachePath + file + '.json');
  },

  /**
   * Create directory for caching
   * @return {void}
   */
  cacheDir : function(){
    if(!fs.existsSync(helpers.baseCachePath)){
      fs.mkdir(helpers.baseCachePath);
    }
  },

  /**
   * Get the cached file
   * @param  {file} file - file name
   * @return {object} file content or false if it doesnt exists
   */
  getCache : function(file){
    file = helpers.basePathFile(file);
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf8' ) : false;
  },

  /**
   * Read the file properties
   * @param  {string} file - file name
   * @return {object} file properties or false if it doesnt exists
   */
  readCache : function(file){
    file = helpers.basePathFile(file);
    return fs.existsSync(file) ? fs.statSync(file) : false;
  },

  /**
   * Store data in file
   * @param  {filenam} file - file name
   * @param  {object} data to storeCache
   * @return {void}
   */
  storeCache : function(file, data){
    if(typeof data === 'object'){
      data = JSON.stringify(data);
    }
    file = helpers.basePathFile(file);
    fs.writeFileSync(file, data);
  }

};
