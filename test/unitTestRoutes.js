var expect  = require('chai').expect;
var rewire = require('rewire');
var approutes = rewire('../src/requestHandler.js');
var should = require('chai').should();
//var request = require('request');

describe('UTC for Routes', function() {

    it('UTC_001 - Testing firstNonRepeatedCharacter fn', function(done) {
        approutes.__get__('firstNonRepeatedCharacter')('asasdffgh').should.equal('d');
        done();
    });
  });