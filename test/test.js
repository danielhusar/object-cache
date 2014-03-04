'use strict';
var assert = require('assert');
var should = require('should');
var Cache  = require('../index');
var cacheSync = new Cache();
var cacheAsync = new Cache({
  async: true
});

var sampleObj = {
  prop: 'val'
};
var sampleObj2 = {
  prop: 'val2'
};

describe('Sunchronous cache tests', function(){

  it('It should store data', function () {
    cacheSync.store('sampleObj.json', sampleObj);
    var sampleObj2 = cacheSync.get('sampleObj.json');
    sampleObj2.prop.should.equal('val');
  });

  it('It should remove data', function () {
    cacheSync.remove('sampleObj.json');
    var sampleObj2 = cacheSync.get('sampleObj.json');
    sampleObj2.should.equal(false);
  });


});


describe('Asynchronous cache tests', function(){
  it('It should store data using callback', function (done) {
    cacheAsync.store('sampleObj.json', sampleObj, function(){
      cacheAsync.get('sampleObj.json', function(error, data){
        data.prop.should.equal('val');
        done();
      });
    });
  });

  it('It should remove data using callback', function (done) {
    cacheAsync.remove('sampleObj.json', function(err, success){
      success.should.equal(true);
      done();
    });
  });

  it('It should store data using promise', function (done) {
    cacheAsync.store('sampleObj2.json', sampleObj2).then(function(){
      cacheAsync.get('sampleObj2.json').then(function(data){
        data.prop.should.equal('val2');
        done();
      });
    });
  });

  it('It should remove data using promise', function (done) {
    cacheAsync.remove('sampleObj2.json').then(function(){
      done();
    });
  });

});
